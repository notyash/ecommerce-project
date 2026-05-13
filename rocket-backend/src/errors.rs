use core::error;

use rocket::Request;
use rocket::http::Status;   
use thiserror::Error;
use rocket::response::{self, Responder, Response};
use rocket::serde::json::{Json, json};

#[catch(default)]
pub fn default_catcher(status: Status, request: &Request) -> Json<serde_json::Value> {
    Json(json!({
        "error": {
            "code": status.code,
            "reason": status.reason_lossy(),
            "path": request.uri().to_string(),
            "message": "An unexpected error occurred."
        }
    }))
}

#[derive(Error, Debug)]
pub enum OAuthExchangeError {
    // #[error] implements the Display trait and writes the string provided in the params for debugging
    #[error("Network failure during OAuth Exchange: {0}")]
    // #[from] implements the From trait for this variant so when using the ? operator in a function which returns this enum (Custom Error)
    // knows how to convert the original error into this variant error by calling the .into() (twin of From) on it.
    Network(#[from] reqwest::Error),
    // Doesn't need #[from] because there isn't any official Error to convert from; just a String.
    #[error("Google API Error: {0}")]
    GoogleApiError(String),
    #[error("Failed to parse token: {0}")]
    ParseError(#[from] serde_json::Error)
}

#[derive(Error, Debug)]
pub enum JwksError {
    #[error("Network failure while fetching jwks: {0}")]
    Network(#[from] reqwest::Error),
    #[error("Failed to parse the jwks response: {0}")]
    ParseError(#[from] serde_json::Error)
}

// Main station for ALL ERRORS
#[derive(Error, Debug)]
pub enum AppError {
    #[error(transparent)]
    OAuth(#[from] OAuthExchangeError),
    #[error(transparent)]
    Authorization(#[from] AuthErrors),
    #[error(transparent)]
    Jwk(#[from] JwksError),
    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),
    #[error("JWT error: {0}")]
    Jwt(#[from] jsonwebtoken::errors::Error),
    #[error("Missing token error")]
    MissingToken,
    #[error("Internal Server Error")]
    Internal, // Catches All Errors
}

#[derive(Error, Debug)]
pub enum AuthErrors {
    #[error("Unverified email provided.")]
    UnverifiedEmail,
    #[error("Invalid email or password.")]
    InvalidCredentials
}


// Used to convert OAuthExchangeError into the general AppError. #[from] macro does this for you
// impl From<OAuthExchangeError> for AppError {
//     fn from(err: OAuthExchangeError) -> Self {
//         AppError::OAuth(err)
//     }
// }
// Used to return status code and the JSON body to the frontend when AppError occurs
impl <'r> Responder<'r, 'static> for AppError {
    fn respond_to(self, _: &'r Request<'_>) -> response::Result<'static> {
        eprintln!("Error occurred: {:?}", self);
        // Can use match &self too - every variable inside the match arms automatically becomes a reference resulting in:
        // can never move data out of these arms. You are restricted to only cloning or copying
        let (status, message) = match self {
            // ref is used instead of & to create a reference because inside match & is used to unpack/deref a value for pattern matching
            // ref - "I'm matching an owned value, but please don't move it; just give me a reference to it."
            // (it was 'ref auth_err' before)
            AppError::OAuth(auth_err) => { 
                match auth_err { 
                    OAuthExchangeError::Network(_) => (Status::ServiceUnavailable, auth_err.to_string()),
                    // clone() because we dont own the 'msg' as auth_err is just a refernce to the OAuthExchangeError enum.
                    OAuthExchangeError::GoogleApiError(msg) => (Status::BadRequest, msg.clone()), 
                    OAuthExchangeError::ParseError(_) => (Status::InternalServerError, auth_err.to_string())
                }
            }
            AppError::Jwk(jwk_err) => {
                match jwk_err {
                    JwksError::Network(_) => (Status::ServiceUnavailable, jwk_err.to_string()),
                    JwksError::ParseError(_) => (Status::InternalServerError, jwk_err.to_string())
                }
            }
            AppError::Database(sqlx::Error::RowNotFound) => {
                (Status::NotFound, "Resource not found".to_string())
            },
            // Catch-all for other DB errors (500)
            AppError::Database(_) => {
                (Status::InternalServerError, "A database error occurred".to_string())
            }
            AppError::Authorization(err) => {
                match err {
                    AuthErrors::UnverifiedEmail => (Status::Unauthorized, err.to_string()),
                    AuthErrors::InvalidCredentials => (Status::Unauthorized, err.to_string())
                }
            }
            AppError::MissingToken  => (Status::Unauthorized, "Token not found.".to_string()),
            AppError::Jwt(err) => (Status::Unauthorized, err.to_string()),
            AppError::Internal => (Status::InternalServerError, "An unexpected error occurred".to_string()),
        };

        let body = json!({
            "status": "error",
            "message": message
        }).to_string(); // Because HTTP only accept bytes (strings). Can't send rust enum/json struct

        Response::build()
            .status(status)
            .header(rocket::http::ContentType::JSON)
            .sized_body(body.len(), std::io::Cursor::new(body)) // setting content-length
            .ok()
    }
}



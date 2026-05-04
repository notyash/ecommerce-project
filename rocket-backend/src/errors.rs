use rocket::Request;
use rocket::http::Status;   
use thiserror::Error;
use rocket::response::{self, Responder, Response};
use serde_json::json;

#[catch(default)]
fn default_catcher(status: Status, request: &Request) -> String { 
    format!("Something went wrong while trying to access this url: '{}'\nStatus: {}", request.uri(), status.code)
}

// Main station for ALL ERRORS
#[derive(Debug)]
pub enum AppError {
    OAuth(OAuthExchangeError),
    // other errors
    Internal, // Catches All Errors
}

// Used to convert OAuthExchangeError into the general AppError.
impl From<OAuthExchangeError> for AppError {
    fn from(err: OAuthExchangeError) -> Self {
        AppError::OAuth(err)
    }
}

// Used to return status code and the JSON body to the frontend when AppError occurs
impl <'r> Responder<'r, 'static> for AppError {
    fn respond_to(self, _: &'r Request<'_>) -> response::Result<'static> {
        eprintln!("Error occurred: {:?}", self);
        // Can use match &self too - every variable inside the match arms automatically becomes a reference resulting in:
        // can never move data out of these arms. You are restricted to only cloning or copying
        let (status, message) = match self {
            // ref is used instead of & to create a reference because inside match & is used to unpack/deref a value for pattern matching
            // ref - "I'm matching an owned value, but please don't move it; just give me a reference to it."
            AppError::OAuth(ref auth_err) => { 
                match auth_err { 
                    OAuthExchangeError::Network(_) => (Status::ServiceUnavailable, auth_err.to_string()),
                    // clone() because we dont own the 'msg' as auth_err is just a refernce to the OAuthExchangeError enum.
                    OAuthExchangeError::GoogleApiError(msg) => (Status::BadRequest, msg.clone()), 
                    OAuthExchangeError::ParseError(_) => (Status::InternalServerError, "Auth data was malformed".to_string())
                }
            }
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


#[derive(Error, Debug)]
pub enum OAuthExchangeError {
    // #[error] implements the Display trait and writes the string provided in the params for debugging
    #[error("Network failure: {0}")]
    // #[from] implements the From trait for this variant so when using the ? operator in a function which returns this enum (Custom Error)
    // knows how to convert the original error into this variant error by calling the .into() (twin of From) on it.
    Network(#[from] reqwest::Error),

    // Doesn't need #[from] because there isn't any official Error to convert from; just a String.
    #[error("Google API Error: {0}")]
    GoogleApiError(String),

    #[error("Failed to parse token: {0}")]
    ParseError(#[from] serde_json::Error)
}
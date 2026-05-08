use rocket::{http::Status, request::{FromRequest, Outcome, Request}};

use crate::{AppState, dto::auth::AuthenticatedUser, errors::AppError, utils::decode_jwt};


#[rocket::async_trait]
impl<'r> FromRequest<'r> for AuthenticatedUser {
    type Error = AppError;
    
    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let token = req.cookies().get_private("auth_token")
            .map(|cookie| cookie.value().to_string());
        match token {
            Some(t) => {
                let state = req.rocket().state::<AppState>().unwrap();

                match decode_jwt(&t, &state.config.jwt_secret) {
                    Ok(claims) => Outcome::Success(AuthenticatedUser
                        {
                        id: claims.sub,
                        role: claims.role
                    }),
                    Err(e) => Outcome::Error((Status::Unauthorized, e))
                }
            }
            None => Outcome::Error((Status::Unauthorized, AppError::MissingToken))
        }
    }
}
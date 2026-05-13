use jsonwebtoken::{DecodingKey, Validation, decode};
use rocket::http::{Cookie, SameSite};
use crate::{dto::auth::AppClaims , errors::AppError };


pub fn generate_jwt(sub: i32, secret_key: &str, session_duration: i64) -> Result<String, AppError> {
    let claims = AppClaims {
        sub,
        exp: (chrono::Utc::now().timestamp() + session_duration)  as usize,
        role: "User".to_string(),
    };

    let token = jsonwebtoken::encode(&jsonwebtoken::Header::default(), &claims,
&jsonwebtoken::EncodingKey::from_secret(secret_key.as_ref()))
    .map_err(|_|AppError::Internal)?;

    Ok(token)
}

pub fn decode_jwt(token: &str, secret: &str) -> Result<AppClaims, AppError> {
    let decoding_key = DecodingKey::from_secret(secret.as_ref());
    let validation = Validation::default();

    let token_data = decode::<AppClaims>(token, &decoding_key, &validation)?;
    Ok(token_data.claims)
}

pub fn build_auth_cookie(token: String, session_duration: i64) -> Cookie<'static> {
    Cookie::build(("auth_token", token))
        .path("/")
        .http_only(true)
        .secure(true)
        .same_site(SameSite::Lax)
        .max_age(rocket::time::Duration::seconds(session_duration))
        .build()
}

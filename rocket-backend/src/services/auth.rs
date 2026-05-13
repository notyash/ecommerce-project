use argon2::{Argon2, PasswordHash, PasswordVerifier};
use rocket::{http::CookieJar, serde::json::Json};

use crate::{AppState, dto::auth::{Credentials, UserDto}, errors::{AppError, AuthErrors}, models::user::{User}, 
    repos::user::{get_user_by_email_with_password, upsert_google_user}, utils::{auth_utils::{build_auth_cookie, generate_jwt}, oauth_utils::{exchange_code_to_token, fetch_jwks, verify_and_decode_google_jwt}}};

pub async fn user_login(credentials: &Credentials, state: &AppState) -> Result<User, AppError> {
    let email = &credentials.email;
    let password = &credentials.password;

    let user = get_user_by_email_with_password(email, &state).await?;

    let stored_hash = user.password_hash
        .as_ref()
        .ok_or(AppError::Authorization(AuthErrors::InvalidCredentials))?;

    let parsed_hash = PasswordHash::new(stored_hash)
    .map_err(|_| AppError::Authorization(AuthErrors::InvalidCredentials))?;

    let is_valid = Argon2::default()
    .verify_password(password.as_bytes(), &parsed_hash)
    .is_ok();

    if !is_valid {
        return Err(AuthErrors::InvalidCredentials.into());
    }
    
    Ok(user.into())
}

pub async fn oauth_login(code: String, state: &AppState) -> Result<User, AppError> {
    let id_token = exchange_code_to_token(code, &state).await?;
    let jwk_keys = fetch_jwks(&state).await?.keys;
    let token_data = verify_and_decode_google_jwt(&state, jwk_keys, &id_token)?;

    if !token_data.claims.email_verified{ return Err(AuthErrors::UnverifiedEmail.into());}

    let google_sub = &token_data.claims.sub;
    let email = token_data.claims.email;
    let name = token_data.claims.name.unwrap_or_else(|| "User".to_string());
    let picture = token_data.claims.picture.unwrap_or_else(|| "".to_string());

    let user = upsert_google_user(&state, google_sub, &email, &name, &picture).await?;

    Ok(user)
}   

pub fn auth_response(user: User, cookies: &CookieJar<'_>, state: &AppState)  -> Result<Json<UserDto>, AppError> {
    let jwt_token = generate_jwt(user.id, &state.config.jwt_secret, state.config.session_duration)?;
    
    let cookie = build_auth_cookie(jwt_token, state.config.session_duration);
    cookies.add_private(cookie);

    Ok(Json(user.to_dto(state)))
}
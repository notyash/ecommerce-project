use argon2::{Argon2, PasswordHash, PasswordVerifier};
use rocket::{http::CookieJar, serde::json::Json};

use crate::{AppState, dto::auth::{LoginCredentials, SignupCredentials, UserDto}, errors::{AppError, AuthErrors}, models::user::User, 
    repos::user::{create_user, get_user_by_email_and_password, upsert_google_user, user_exists}, utils::{auth_utils::{build_auth_cookie, generate_jwt, hash_password}, oauth_utils::{exchange_code_to_token, fetch_jwks, verify_and_decode_google_jwt}}};

pub async fn user_login(credentials: &LoginCredentials, state: &AppState) -> Result<User, AppError> {
    let email = &credentials.email;
    let password = &credentials.password;

    let user = get_user_by_email_and_password(email, &state).await?;

    let stored_hash = user.password_hash
        .as_ref()
        .ok_or(AppError::Authorization(AuthErrors::InvalidCredentials))?; // no password set but trying to sign in with password

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

pub async fn user_signup(credentials: &SignupCredentials, state: &AppState) -> Result<User, AppError> {
    let email = &credentials.email;

    if user_exists(email, state).await? { return Err(AuthErrors::UserAlreadyExists.into());}

    let username = &credentials.username;
    let full_name = credentials.full_name.as_deref();
    let password_hash = hash_password(&credentials.password)?;
    let user = create_user(state, email, username, &password_hash, full_name, &state.config.backup_avatar).await?;

    Ok(user)
}

pub async fn user_oauth_login(code: String, state: &AppState) -> Result<User, AppError> {
    let id_token = exchange_code_to_token(code, &state).await?;
    let jwk_keys = fetch_jwks(&state).await?.keys;
    let token_data = verify_and_decode_google_jwt(&state, jwk_keys, &id_token)?;

    if !token_data.claims.email_verified{ return Err(AuthErrors::UnverifiedEmail.into());}

    let google_sub = &token_data.claims.sub;
    let email = token_data.claims.email;
    let name = token_data.claims.name.unwrap_or_else(|| "User".to_string());
    let picture = token_data.claims.picture.unwrap_or_else(|| (&state.config.backup_avatar).to_string());

    let user = upsert_google_user(&state, google_sub, &email, &name, &picture).await?;

    Ok(user)
}   

pub fn auth_response(user: User, cookies: &CookieJar<'_>, state: &AppState)  -> Result<Json<UserDto>, AppError> {
    let jwt_token = generate_jwt(user.id, &state.config.jwt_secret, state.config.session_duration)?;
    
    let cookie = build_auth_cookie(jwt_token, state.config.session_duration);
    cookies.add_private(cookie);

    Ok(Json(user.to_dto(state)))
}
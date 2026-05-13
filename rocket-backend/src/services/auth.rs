use argon2::{Argon2, PasswordHash, PasswordVerifier};

use crate::{AppState, dto::auth::{Credentials}, errors::{AppError, AuthErrors}, models::user::User, repos::user::get_user_by_email_with_password};

pub async fn login_user(credentials: &Credentials, state: &AppState) -> Result<User, AppError> {
    let email = &credentials.email;
    let password = &credentials.password;

    let user = get_user_by_email_with_password(email, &state).await?;
    let parsed_hash = PasswordHash::new(&user.password_hash)
        .map_err(|_| AppError::Authorization(AuthErrors::InvalidCredentials))?; // if db has bad hashed password stored inside

    let is_valid = Argon2::default()
    .verify_password(password.as_bytes(), &parsed_hash)
    .is_ok();

    if !is_valid {
        return Err(AuthErrors::InvalidCredentials.into());
    }
    
    Ok(user)
}
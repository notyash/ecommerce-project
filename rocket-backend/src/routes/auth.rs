use rocket::{State, http::{Status}, serde::json::Json};
use crate::{AppState, dto::auth::{AuthenticatedUser, LoginCredentials, OAuthCode, SignupCredentials, UserDto},
 errors::AppError, repos::user::get_public_user_by_id, services::auth::{auth_response, user_login, user_oauth_login, user_signup}, utils::auth_utils::decode_jwt};
use rocket::http::{Cookie, CookieJar};
use std::time::{SystemTime, UNIX_EPOCH};
use redis::AsyncCommands;

pub fn routes() -> Vec<rocket::Route> {
    routes![oauth_login, me, signup, logout, login]
}

#[get("/me")]
async fn me(user: AuthenticatedUser, state: &State<AppState>) -> Result<Json<UserDto>, AppError> {
    let user_record = get_public_user_by_id(user.id, &state).await?;
    Ok(Json(user_record.to_dto(&state)))
}

#[post("/signup", data="<credentials>")]
async fn signup(credentials: Json<SignupCredentials>, cookies: &CookieJar<'_>, state: &State<AppState>) -> Result<Json<UserDto>, AppError> {
    let user = user_signup(&credentials, state.inner()).await?;
    auth_response(user, cookies, state.inner())
}

#[post("/login", data="<credentials>")]
async fn login(cookies: &CookieJar<'_>, credentials: Json<LoginCredentials>, state: &State<AppState>) -> Result<Json<UserDto>, AppError> {
    let user = user_login(&credentials, &state).await?;
    auth_response(user, cookies, &state)
}
    
#[post("/oauth", data="<code>")]
async fn oauth_login(cookies: &CookieJar<'_>, code: Json<OAuthCode>, state: &State<AppState>) -> Result<Json<UserDto>, AppError> {
    // into_inner just looks at the AuthCode from the Json<AuthCode>
    let user = user_oauth_login(code.into_inner().code, &state).await?;
    auth_response(user, cookies, &state)
}

#[post("/logout")]
async fn logout(cookies: &CookieJar<'_>) -> Result<Status, AppError> {
    cookies.remove_private(Cookie::from("auth_token"));
    Ok(Status::NoContent)
}
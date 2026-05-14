use rocket::{State, http::{Status}, serde::json::Json};
use crate::{AppState, dto::auth::{AuthenticatedUser, LoginCredentials, OAuthCode, UserDto}, errors::AppError, models::user::User, repos::user::get_public_user_by_id, services::auth::{auth_response, oauth_login, user_login}};
use rocket::http::{Cookie, CookieJar};

pub fn routes() -> Vec<rocket::Route> {
    routes![oauth, me, signup, logout, login]
}

#[get("/me")]
async fn me(user: AuthenticatedUser, state: &State<AppState>) -> Result<Json<UserDto>, AppError> {
    let user_record = get_public_user_by_id(user.id, &state).await?;
    Ok(Json(user_record.to_dto(&state)))
}

#[post("/signup", data="<credentials>")]
async fn signup(credentials: Json<SignupCredentials>) -> Result<Json<UserDto>, AppError> {
    
}

#[post("/login", data="<credentials>")]
async fn login(cookies: &CookieJar<'_>, credentials: Json<LoginCredentials>, state: &State<AppState>) -> Result<Json<UserDto>, AppError> {
    let user = user_login(&credentials, &state).await?;
    auth_response(user, cookies, &state)
}

#[post("/logout")]
async fn logout(cookies: &CookieJar<'_>) -> Result<Status, AppError> {
    cookies.remove_private(Cookie::from("auth_token"));
    Ok(Status::NoContent)
}

#[post("/oauth", data="<code>")]
async fn oauth(cookies: &CookieJar<'_>, code: Json<OAuthCode>, state: &State<AppState>) -> Result<Json<UserDto>, AppError> {
    // into_inner just looks at the AuthCode from the Json<AuthCode>
    let user = oauth_login(code.into_inner().code, &state).await?;
    auth_response(user, cookies, &state)
}


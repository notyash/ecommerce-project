use rocket::{State, http::{Status}, serde::json::Json};
use crate::{AppState, dto::auth::{AuthenticatedUser, Credentials, OAuthCode, UserDto}, errors::AppError, repos::user::get_public_user_by_id, 
    services::auth::{login_user, oauth_login_user}, utils::{build_auth_cookie, generate_jwt}};
use rocket::http::{Cookie, CookieJar};

pub fn routes() -> Vec<rocket::Route> {
    routes![oauth, me, logout, login]
}

#[get("/me")]
async fn me(user: AuthenticatedUser, state: &State<AppState>) -> Result<Json<UserDto>, AppError> {
    let user_record = get_public_user_by_id(user.id, &state).await?;
    Ok(Json(user_record.to_dto(&state)))
}

#[post("/login", data="<credentials>")]
async fn login(cookies: &CookieJar<'_>, credentials: Json<Credentials>, state: &State<AppState>) -> Result<Json<UserDto>, AppError> {
    let user = login_user(&credentials, &state).await?;
    let jwt_token = generate_jwt(user.id, &state.config.jwt_secret, state.config.session_duration)?;
    
    let cookie = build_auth_cookie(jwt_token, state.config.session_duration);
    cookies.add_private(cookie);

    Ok(Json(user.to_dto(&state)))
}

#[post("/logout")]
async fn logout(cookies: &CookieJar<'_>) -> Result<Status, AppError> {
    cookies.remove_private(Cookie::from("auth_token"));
    Ok(Status::NoContent)
}

#[post("/oauth", data="<code>")]
async fn oauth(cookies: &CookieJar<'_>, code: Json<OAuthCode>, state: &State<AppState>) -> Result<Json<UserDto>, AppError> {
    // into_inner just looks at the AuthCode from the Json<AuthCode>
    let user = oauth_login_user(code.into_inner().code, &state).await?;
    let jwt_token = generate_jwt(user.id, &state.config.jwt_secret, state.config.session_duration)?;
    
    let cookie = build_auth_cookie(jwt_token, state.config.session_duration);
    cookies.add_private(cookie);

    Ok(Json(user.to_dto(&state)))

}


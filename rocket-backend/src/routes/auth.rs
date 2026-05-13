use rocket::{State, http::{SameSite, Status}, serde::json::Json};
use crate::{AppState, dto::auth::{AuthenticatedUser, Credentials, OAuthCode, UserDto}, errors::{AppError, AuthErrors}, repos::user::{get_public_user_by_id, upsert_google_user}, 
    services::auth::login_user, utils::{build_auth_cookie, exchange_code_to_token, fetch_jwks, generate_jwt, verify_and_decode_google_jwt}};
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
    let oauth = code.into_inner().code;
    let id_token = exchange_code_to_token(oauth, &state).await?;
    let jwk_keys = fetch_jwks(&state).await?.keys;
    let token_data = verify_and_decode_google_jwt(&state, jwk_keys, &id_token)?;

    if !token_data.claims.email_verified{ return Err(AuthErrors::UnverifiedEmail.into());}

    let google_sub = &token_data.claims.sub;
    let email = token_data.claims.email;
    let name = token_data.claims.name.unwrap_or_else(|| "User".to_string());
    let picture = token_data.claims.picture.unwrap_or_else(|| "".to_string());

    let user = upsert_google_user(&state, google_sub, &email, &name, &picture).await?;
    let jwt_token = generate_jwt(user.id, &state.config.jwt_secret, state.config.session_duration)?;

    let cookie = Cookie::build(("auth_token", jwt_token))
        .path("/")
        .http_only(true)
        .secure(true)
        .same_site(SameSite::Lax)
        .max_age(rocket::time::Duration::seconds(state.config.session_duration))
        .build();

    cookies.add_private(cookie);

    Ok(Json(user.to_dto(&state)))

}


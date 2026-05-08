use rocket::{State, http::{SameSite, Status}, serde::json::Json};
use crate::{AppState, dto::auth::{AuthenticatedUser, OAuthCode, UserDto}, errors::{AppError, AuthErrors}, models::user::User, utils::{exchange_code_to_token, fetch_jwks, generate_jwt, get_or_create_user, verify_and_decode_google_jwt}};
use rocket::http::{Cookie, CookieJar};

pub fn routes() -> Vec<rocket::Route> {
    routes![oauth, me, logout]
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

    let user = get_or_create_user(&state, google_sub, &email, &name, &picture).await?;
    let jwt_token = generate_jwt(user.id, &state)?;

    let cookie = Cookie::build(("auth_token", jwt_token))
        .path("/")
        .http_only(true)
        .secure(true)
        .same_site(SameSite::Lax)
        .max_age(rocket::time::Duration::seconds(state.config.session_duration))
        .build();

    cookies.add_private(cookie);
    let backup_image = &state.config.backup_avatar.clone();

    Ok(Json(user.to_dto(backup_image)))

}

#[get("/me")]
async fn me(user: AuthenticatedUser, state: &State<AppState>) -> Result<Json<UserDto>, AppError> {
    let user_record = sqlx::query_as!(User,
        "SELECT id, google_id, email, full_name, avatar_url, role, is_active, created_at FROM users WHERE id = $1", user.id)
        .fetch_one(&state.pool)
        .await?;
    
    let backup_image = &state.config.backup_avatar;
    Ok(Json(user_record.to_dto(backup_image)))
}

#[post("/logout")]
async fn logout(cookies: &CookieJar<'_>) -> Result<Status, AppError> {
    cookies.remove_private(Cookie::from("auth_token"));
    Ok(Status::NoContent)
}
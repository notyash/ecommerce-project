use rocket::{State, serde::json::Json};
use serde::de::Error;
use crate::{AppState, dto::auth::{GoogleClaims, JWT, OAuthCode}, errors::{AppError, JwksError}, utils::{exchange_code_to_token, fetch_jwks, generate_jwt, verify_and_decode_google_jwt}};


pub fn routes() -> Vec<rocket::Route> {
    routes![oauth]
}

#[post("/oauth", data="<code>")]
async fn oauth(code: Json<OAuthCode>, state: &State<AppState>) -> Result<Json<JWT>, AppError> {
    // into_inner just looks at the AuthCode from the Json<AuthCode>
    let oauth = code.into_inner().code;

    let id_token = exchange_code_to_token(oauth, state.inner()).await?;

    let jwk_keys = fetch_jwks(state.inner()).await?.keys;

    let token_data = verify_and_decode_google_jwt(state.inner(), jwk_keys, &id_token)?;

    let jwt_token = generate_jwt(state.inner(), token_data)?;
    println!("{:?}", jwt_token);
    Ok(Json(jwt_token))

}

use rocket::{State, serde::json::Json};
use crate::{AppState, dto::auth::{JWT, OAuthCode}, errors::{AppError}, utils::{exchange_code_to_token, fetch_jwks, generate_jwt, get_or_create_user, verify_and_decode_google_jwt}};


pub fn routes() -> Vec<rocket::Route> {
    routes![oauth]
}

#[post("/oauth", data="<code>")]
async fn oauth(code: Json<OAuthCode>, state: &State<AppState>) -> Result<Json<JWT>, AppError> {
    // into_inner just looks at the AuthCode from the Json<AuthCode>
    let oauth = code.into_inner().code;
    let id_token = exchange_code_to_token(oauth, &state).await?;
    let jwk_keys = fetch_jwks(&state).await?.keys;
    let token_data = verify_and_decode_google_jwt(&state, jwk_keys, &id_token)?;
    
    let google_sub = &token_data.claims.sub;
    let email = token_data.claims.email;

    let user_id = get_or_create_user(&state, google_sub, &email).await?;
    let jwt_token = generate_jwt(user_id, &state, email)?;
    // println!("{:?}", jwt_token);
    Ok(Json(jwt_token))
}

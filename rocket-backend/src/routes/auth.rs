use rocket::{State, response::status::NotFound, serde::json::Json};
use crate::{AppState, dto::auth::{GoogleResponse, JWT, OAuthCode}, errors::{AppError, OAuthExchangeError}, utils::exchange_code_to_token};


pub fn routes() -> Vec<rocket::Route> {
    routes![oauth]
}

#[post("/oauth", data="<code>")]
async fn oauth(code: Json<OAuthCode>, state: &State<AppState>) -> Result<Json<JWT>, AppError> {
    // into_inner just looks at the AuthCode from the Json<AuthCode>
    let oauth = code.into_inner().code;
    let token = exchange_code_to_token(oauth, state.inner()).await?;
  
    Ok(Json(JWT { token }))

}

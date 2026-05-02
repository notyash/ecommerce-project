use std::{collections::HashMap};
use rocket::{State, serde::json::Json};
use crate::{config::Config, dto::auth::OAuth};

pub fn routes() -> Vec<rocket::Route> {
    routes![oauth]
}

#[post("/oauth", data="<code>")]
async fn oauth(code: Json<OAuth>, config: &State<Config>) -> String {
    let mut params: HashMap<&str, &str> = HashMap::new();
    let oauth = code.into_inner().code;
    params.insert("code", &oauth);
    params.insert("client_secret", &config.oauth_secret);
    params.insert("client_id", &config.oauth_client);
    params.insert("redirect_uri", &config.oauth_redirect_uri);
    params.insert("grant_type", "authorization_code");

    let response = reqwest::Client::new().post("https://oauth2.googleapis.com/token").form(&params).send().await;
    println!("{:?}", response.unwrap().text().await.unwrap());
    "hi".to_string()
}
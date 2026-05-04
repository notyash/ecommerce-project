use serde::{Deserialize, Serialize};


#[derive(Deserialize, Serialize)]
pub struct OAuthCode {
    pub code: String,
}

#[derive(Deserialize, Serialize)]
pub struct JWT {
    pub token: String, 
}

#[derive(Deserialize, Serialize, Debug)]
pub struct GoogleResponse {
    pub access_token: String,
    pub expires_in: i64,
    pub id_token: String,
    pub refresh_token: String,
    pub scope: String,
    pub token_type: String
}
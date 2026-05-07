use serde::{Deserialize, Serialize};


#[derive(Deserialize, Serialize)]
pub struct OAuthCode {
    pub code: String,
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

#[derive(Deserialize, Serialize, Debug)]
pub struct GoogleClaims { // of googles jwt token
    pub sub: String,
    pub email: String,
    pub email_verified: bool, // Recommended security check
    pub name: Option<String>,
    pub picture: Option<String>,
    pub exp: i64,
    pub aud: String,
    pub iss: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AppClaims { // of our own jwt token
    pub sub: i32,    
    pub email: String,
    pub exp: usize,     
    pub role: String,
    pub name: String,
    pub picture: String
}

#[derive(Serialize)]
pub struct UserDto {
    pub email: String,
    pub name: String,
    pub picture: String,
    pub role: String,
    pub is_active: bool,
}

#[derive(Debug, Deserialize)]
pub struct JwksResponse {
    pub keys: Vec<Jwk>,
}

#[derive(Debug, Deserialize)]
pub struct Jwk {
    pub kty: String, // Key Type (usually "RSA")
    pub kid: String, // Key ID
    pub n: String,   // RSA Modulus
    pub e: String,   // RSA Exponent
}
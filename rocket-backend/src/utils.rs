use jsonwebtoken::{TokenData};
use crate::{AppState, dto::auth::{AppClaims, GoogleClaims, GoogleResponse, JWT, Jwk, JwksResponse}, errors::{AppError, JwksError, OAuthExchangeError}};
use serde::de::Error;


pub async fn exchange_code_to_token(code: String, state: &AppState) -> Result<String, OAuthExchangeError> {
    let params = [
        ("code",  code.as_str()),
        // We use &state because 'oauth_secret' is a String and we cannot consume complex object like String which does not implement the Copy trait
        // from a reference itself - state in this case which is: &AppState
        // NOTE: . - access operator and . - chaining operator has higher precedence over & - reference operator.
        // So, here the value is accessed first then converted into a referenced value using &
        ("client_secret", &state.config.oauth_secret), 
        ("client_id", &state.config.oauth_client),
        ("redirect_uri", &state.config.oauth_redirect_uri),
        ("grant_type", "authorization_code"),
    ];

    // Here, we can use & and get a referenced object after all chanied methods are complete 
    // BUT, we are not doing it because in the next line we need to pass an owned value of that object to the 'error_for_status()' function
    let response = state.client.post("https://oauth2.googleapis.com/token")
                                                        .form(&params)
                                                        .send()
                                                        .await?; // Network Error
    // If we pass a referenced object here, it'll panic because 'error_for_status()' has self in the signature and not &self
    // Meaning, it wants to own that object to do whatever it pleases with it and not just look at it like a referenced object
    match response.error_for_status() {
        Ok(res) => {
            let token_data: GoogleResponse = res.json().await?; // Parse Error
            println!("{}", serde_json::to_string_pretty(&token_data).unwrap());
            Ok(token_data.id_token)
        }
        
        Err(e) => {
            eprintln!("Google Auth Error: {:?}", e);
            Err(OAuthExchangeError::GoogleApiError(format!("OAuth Failed: {}", e)))
        }
    }
}

pub async fn fetch_jwks(state: &AppState) -> Result<JwksResponse, JwksError> {
    let response = state.client
        .get(&state.config.jwks_uri) 
        .send()
        .await?
        .error_for_status()?; // btw '?' operator unwraps a result - if Err -> call into(), if Ok -> return inner value

    let jwks = response.json::<JwksResponse>().await?;

    Ok(jwks)
}

pub fn generate_jwt(state: &AppState, token_data: TokenData<GoogleClaims>) -> Result<JWT, AppError> {
    let secret_key = &state.config.jwt_secret;
    let expiration = 3600;

    let email = token_data.claims.email;
    let sub = token_data.claims.sub;

    let claims = AppClaims {
        sub,
        email,
        exp: (chrono::Utc::now().timestamp() as usize) + expiration,
        role: "user".to_string()
    };

    let token = jsonwebtoken::encode(&jsonwebtoken::Header::default(), &claims,
                                                                                 &jsonwebtoken::EncodingKey::from_secret(secret_key.as_ref()))
                                                                                 .map_err(|_|AppError::Internal)?;

    Ok(JWT{token})
}

pub fn verify_and_decode_google_jwt(state: &AppState, jwk_keys: Vec<Jwk>, id_token: &str) -> Result<TokenData<GoogleClaims>, AppError> {
    let header = jsonwebtoken::decode_header(id_token).map_err(|_| AppError::Internal)?;
    let kid = header.kid.ok_or_else(|| { // closure only runs when kid is None
                        AppError::Jwk(JwksError::ParseError(
                        serde_json::Error::custom("Missing 'kid' in JWT header")))})?;

    let jwk = jwk_keys.iter().find(|&key| key.kid == kid).ok_or_else(|| {
                                    AppError::Jwk(JwksError::ParseError(serde_json::Error::custom("No matching JWK found for kid.")))
                                })?;

    let decoding_key = jsonwebtoken::DecodingKey::from_rsa_components(&jwk.n, &jwk.e)
                                        .map_err(|_| AppError::Internal)?; // Rivest-Shamir-Adleman to verify the key

    let mut validation = jsonwebtoken::Validation::new(jsonwebtoken::Algorithm::RS256);
    validation.set_audience(&[state.config.oauth_client.clone()]);
    validation.set_issuer(&["https://accounts.google.com", "accounts.google.com"]);

    let token_data  = jsonwebtoken::decode::<GoogleClaims>(&id_token, &decoding_key, &validation)
                                                                                    .map_err(|_| AppError::Internal)?;
    Ok(token_data)
}
use crate::{AppState, dto::auth::GoogleResponse, errors::OAuthExchangeError};


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
                                                        .await?;
    // If we pass a referenced object here, it'll panic because 'error_for_status()' has self in the signature and not &self
    // Meaning, it wants to own that object to do whatever it pleases with it and not just look at it like a referenced object
    match response.error_for_status() {
        Ok(res) => {
            let token_data: GoogleResponse = res.json().await?;
            println!("{}", serde_json::to_string_pretty(&token_data).unwrap());
            Ok(token_data.access_token)
        }
        
        Err(e) => {
            eprintln!("Google Auth Error: {:?}", e);
            Err(OAuthExchangeError::GoogleApiError(format!("OAuth Failed: {}", e)))
        }
    }
}
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct PaymentIntentResponse {
    pub id: String,
    pub client_secret: Option<String>,
    pub status: String,
}
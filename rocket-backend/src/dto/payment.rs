use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct PaymentIntentResponse {
    pub id: String,
    pub client_secret: String,
}

#[derive(Deserialize)]
pub struct EventObject {
    pub data: EventData,
    pub r#type: String
}

#[derive(Deserialize)]
pub struct EventData {
    pub object: StripeId
}

#[derive(Deserialize)]
pub struct StripeId {
    pub id: String
}


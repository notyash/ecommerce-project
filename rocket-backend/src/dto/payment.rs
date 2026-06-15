use serde::{Deserialize, Serialize};
use crate::models::payment::OrderStatus;


#[derive(Debug, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum PaymentIntentStatus {
    RequiresPaymentMethod,
    RequiresConfirmation,
    RequiresAction,
    Processing,
    RequiresCapture,
    Canceled,
    Succeeded,

    #[serde(other)]
    Unknown,
}

impl PaymentIntentStatus {
    pub fn can_initialize_elements(&self) -> bool {
        matches!(
            self,
            Self::RequiresPaymentMethod |
            Self::RequiresConfirmation |
            Self::RequiresAction
        )
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct PaymentIntentResponse {
    pub id: String,
    pub client_secret: String,
    pub status: OrderStatus
}

#[derive(Debug, Deserialize)]
pub struct StripePaymentIntent {
    pub id: String,
    pub client_secret: String,
    pub status: PaymentIntentStatus,
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


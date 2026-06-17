use serde::{Deserialize, Serialize};


#[derive(Debug, Deserialize, PartialEq, Eq, Serialize)]
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
    pub status: PaymentIntentStatus
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

#[derive(Debug, Deserialize, Clone, Copy, FromFormField, sqlx::Type, Serialize, PartialEq)]
#[serde(rename_all = "lowercase")]
#[sqlx(rename_all = "lowercase")]
#[sqlx(type_name = "selected_currency")]
pub enum Currency {
    Inr,
    Usd,
}

impl Currency {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Inr => "inr",
            Self::Usd => "usd"
        }
    }
}

#[derive(Deserialize, PartialEq)]
pub struct CheckoutRequest {
    pub currency: Currency
}

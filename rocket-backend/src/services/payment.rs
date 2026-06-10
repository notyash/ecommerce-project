use bigdecimal::BigDecimal;
use reqwest::Client;
use crate::{AppState, dto::payment::PaymentIntentResponse, errors::AppError, repos::cart::get_all_prices_and_quantity_in_cart};


pub async fn calculate_total_price(cart_id: i32, state: &AppState) -> Result<bigdecimal::BigDecimal, AppError> {
    let prices_and_quantity = get_all_prices_and_quantity_in_cart(cart_id, state).await?;
    let mut total_price: BigDecimal = BigDecimal::from(0);
    for item in prices_and_quantity {
        total_price += item.current_price *  BigDecimal::from(item.quantity)
    }   
    Ok(total_price.normalized())
}

pub async fn create_payment_intent(total_price_in_cents: i64, state: &AppState) -> Result<PaymentIntentResponse, reqwest::Error> {
    let client = Client::new();
    
    let payment_intent_response = client.post("https://api.stripe.com/v1/payment_intents")
        .basic_auth(&state.config.stripe_secret, Some(""))
        .form(&[
            ("amount", total_price_in_cents.to_string()),
            ("currency", "usd".to_string()),       
        ])
        .send()
        .await?
        .error_for_status()?
        .json::<PaymentIntentResponse>()
        .await?;

    Ok(payment_intent_response)
}


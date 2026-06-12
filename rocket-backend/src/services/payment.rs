use bigdecimal::{BigDecimal, ToPrimitive};
use reqwest::Client;
use crate::{AppState, dto::payment::PaymentIntentResponse, errors::AppError, repos::{cart::get_all_prices_and_quantity_in_cart, payment::save_order}};


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

pub async fn create_order(cart_id: i32, state: &AppState, user_id: i32) -> Result<PaymentIntentResponse, AppError>{
    let total_amount = calculate_total_price(cart_id, state).await?;
    let total_amount_in_cents = (&total_amount * BigDecimal::from(100))
        .normalized()
        .to_i64()
        .ok_or(AppError::Internal)?;

    let payment_res = create_payment_intent(total_amount_in_cents, state).await?;
    save_order(state, &payment_res.id, user_id, cart_id, &total_amount, &payment_res.client_secret).await?;

    Ok(payment_res)
}
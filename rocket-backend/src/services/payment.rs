use bigdecimal::{BigDecimal, ToPrimitive, RoundingMode};
use colored::Colorize;
use reqwest::Client;
use rocket::http::Status;
use crate::{AppState, dto::payment::{Currency, PaymentIntentResponse, StripePaymentIntent}, errors::AppError::{self}, models::payment::OrderStatus, repos::{cart::get_all_prices_and_quantity_in_cart, payment::{mark_existing_order_cancelled, save_order}}};


pub async fn calculate_total_price(cart_id: i32, state: &AppState) -> Result<bigdecimal::BigDecimal, AppError> {
    let prices_and_quantity = get_all_prices_and_quantity_in_cart(cart_id, state).await?;
    let mut total_price: BigDecimal = BigDecimal::from(0);
    for item in prices_and_quantity {
        total_price += item.current_price *  BigDecimal::from(item.quantity)
    }   
    Ok(total_price.normalized())
}

pub async fn get_payment_intent_from_stripe(state: &AppState, user_id: i32, cart_id: i32, stripe_id: &str) -> Result<StripePaymentIntent, AppError> {
    let client = Client::new();

    let payment_intent = client.get(format!("https://api.stripe.com/v1/payment_intents/{}", stripe_id))
        .basic_auth(&state.config.stripe_secret, Some(""))
        .send()
        .await?
        .error_for_status()?
        .json::<StripePaymentIntent>()
        .await?;

    if !payment_intent.status.can_initialize_elements() {
        eprintln!("{:}", "expired intent".red());
        mark_existing_order_cancelled(state, user_id, cart_id, stripe_id).await?;
        return Err(AppError::Payment("Payment intent expired/marked cancelled".into()))
    }

    Ok(payment_intent)
}

pub async fn create_payment_intent(amount_in_base_unit: i64, state: &AppState, currency: &Currency) -> Result<StripePaymentIntent, AppError> {
    let client = Client::new();
    let mut form: Vec<(&str, String)> = vec![("amount", amount_in_base_unit.to_string()), ("currency", currency.as_str().to_string())];

    match currency {
        Currency::Inr => {
            form.push(("payment_method_types[]", "upi".to_string()));
            form.push(("payment_method_types[]", "card".to_string()));
        },
        Currency::Usd => {
            form.push(("payment_method_types[]", "amazon_pay".to_string()));
            form.push(("payment_method_types[]", "card".to_string()));
        }
    }

    let payment_intent_response = client.post("https://api.stripe.com/v1/payment_intents")
        .basic_auth(&state.config.stripe_secret, Some(""))
        .form(&form)
        .send()
        .await?;

    let status = payment_intent_response.status();
    let body = payment_intent_response.text().await?;

    if !status.is_success() { return Err(AppError::Payment(body)) }

    let payment_intent: StripePaymentIntent = serde_json::from_str(&body)
        .map_err(|err| AppError::Payment(err.to_string()))?;
    
    Ok(payment_intent)
}

pub async fn cancel_payment_intent(intent_id: &str, state: &AppState) -> Result<Status, AppError> {
    let client = Client::new();

    client.post(format!("https://api.stripe.com/v1/payment_intents/{}/cancel", intent_id))
    .basic_auth(&state.config.stripe_secret, Some(""))
    .send()
    .await?
    .error_for_status()?;

    Ok(Status::Ok)

}

pub async fn create_order(total_amount: BigDecimal, state: &AppState, user_id: i32, cart_id: i32, currency: &Currency) -> Result<PaymentIntentResponse, AppError>{
    let amount_in_base_unit = (&total_amount * BigDecimal::from(100))
        .normalized()
        .to_i64()
        .ok_or(AppError::Internal("Invalid amount".into()))?;

    let payment_res = create_payment_intent(amount_in_base_unit, state, currency).await?;
    save_order(state, &payment_res.id, user_id, cart_id, &total_amount).await?;

    Ok(PaymentIntentResponse { id: payment_res.id, client_secret: payment_res.client_secret, status: OrderStatus::Pending })
}

pub fn convert_usd_to_inr(conversion_rate: &BigDecimal, usd: BigDecimal) -> BigDecimal { // TODO: Add live fetching of conversion rate from API later
    (usd * conversion_rate).with_scale_round(2, RoundingMode::HalfUp)
}
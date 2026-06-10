use bigdecimal::{BigDecimal, ToPrimitive};
use rocket::{State, serde::json::Json};
use crate::{AppState, dto::{auth::AuthenticatedUser, payment::PaymentIntentResponse}, errors::AppError, repos::{cart::get_or_create_cart, payment::create_order}, services::payment::{calculate_total_price, create_payment_intent}};

pub fn routes() -> Vec<rocket::Route> {
    routes![stripe]
}

#[post("/stripe")]
async fn stripe(user: AuthenticatedUser, state: &State<AppState>) -> Result<Json<PaymentIntentResponse>, AppError> {
    let cart = get_or_create_cart(user.id, state.inner()).await?; // TODO: separate the getting and creating logic for this fn
    let total_amount = calculate_total_price(cart.id, state.inner()).await?;
    let total_amount_in_cents = (&total_amount * BigDecimal::from(100))
        .normalized()
        .to_i64()
        .ok_or(AppError::Internal)?;

    let payment_res = create_payment_intent(total_amount_in_cents, state.inner()).await?;
    create_order(state.inner(), &payment_res.id, user.id, cart.id, &total_amount).await?;

    Ok(Json(payment_res))
}   
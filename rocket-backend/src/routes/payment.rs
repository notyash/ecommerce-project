use rocket::{State, http::Status, serde::json::Json};
use crate::{AppState, dto::{auth::AuthenticatedUser, payment::{CheckoutRequest, EventObject, PaymentIntentResponse}}, errors::AppError, repos::{cart::get_or_create_cart, payment::{get_pending_order, mark_existing_order_cancelled, update_order_failed, update_order_succeeded}}, services::payment::{calculate_total_price, cancel_payment_intent, create_order, get_payment_intent_from_stripe}};


pub fn routes() -> Vec<rocket::Route> {
    routes![stripe, webhook]
}

#[post("/stripe", data="<request>")]
async fn stripe(user: AuthenticatedUser, state: &State<AppState>, request: Json<CheckoutRequest>) -> Result<Json<PaymentIntentResponse>, AppError> {
    let cart = get_or_create_cart(user.id, state.inner()).await?; // TODO: separate the getting and creating logic for this fn
    let existing_order = get_pending_order(state.inner(), user.id, cart.id).await?;
    let current_total_amount = calculate_total_price(cart.id, state.inner()).await?;

    match existing_order {
        Some(existing_order) => {
            if current_total_amount != existing_order.total_amount {
                let order = create_order(current_total_amount, state.inner(), user.id, cart.id, &request.currency).await?;
                mark_existing_order_cancelled(state.inner(), user.id, cart.id, &existing_order.stripe_id).await?;
                cancel_payment_intent(&existing_order.stripe_id, state.inner()).await?;
                return Ok(Json(order))
            }
            let payment_intent = get_payment_intent_from_stripe(state.inner(), user.id, cart.id, &existing_order.stripe_id).await?;
            Ok(Json(PaymentIntentResponse{
            client_secret: payment_intent.client_secret,
            id: existing_order.stripe_id,
            status: existing_order.status 
            }))

        },
        None => {
            let order = create_order(current_total_amount, state.inner(), user.id, cart.id, &request.currency).await?;
            Ok(Json(order))
        }
    }  
}

#[post("/webhook", data="<event>")]
async fn webhook(state: &State<AppState>, event: Json<EventObject>) -> Result<Status, AppError> {
    let stripe_id = &event.data.object.id;
    let event_type = &event.r#type;

    match event_type.as_str() {
        "payment_intent.succeeded" => {
            update_order_succeeded(stripe_id, state.inner()).await?;
            Ok(Status::Ok)
        },
        "payment_intent.payment_failed" => {
            update_order_failed(stripe_id, state.inner()).await?;
            Ok(Status::Ok)
        },
        _ => Ok(Status::NoContent)
    }
}
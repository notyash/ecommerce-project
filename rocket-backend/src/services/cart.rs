use crate::AppState;
use crate::repos::payment::{get_pending_order, mark_existing_order_cancelled};
use crate::errors::AppError;
use crate::services::payment::cancel_payment_intent;

pub async fn invalidate_pending_checkout_if_exists(state: &AppState, user_id: i32, cart_id: i32) -> Result<bool, AppError> {
    let pending_order = get_pending_order(state, user_id, cart_id).await?;

    match pending_order {
        Some(order) => {
            mark_existing_order_cancelled(state, user_id, cart_id, &order.stripe_id).await?;
            if let Err(err) = cancel_payment_intent(&order.stripe_id, state).await {
                eprintln!("Failed to cancel stale Stripe PaymentIntent {}: {:?}", order.stripe_id, err)
            }
            Ok(true)
        },
        None => {
            Ok(false)
        }
    }
}
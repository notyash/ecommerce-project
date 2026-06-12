use rocket::{State, http::Status, serde::json::Json};
use crate::{AppState, dto::{auth::AuthenticatedUser, payment::{EventObject, PaymentIntentResponse}}, errors::AppError, repos::{cart::get_or_create_cart, payment::get_order}, services::payment::create_order};

pub fn routes() -> Vec<rocket::Route> {
    routes![stripe, webhook]
}

#[post("/stripe")]
async fn stripe(user: AuthenticatedUser, state: &State<AppState>) -> Result<Json<PaymentIntentResponse>, AppError> {
    let cart = get_or_create_cart(user.id, state.inner()).await?; // TODO: separate the getting and creating logic for this fn
    let order = get_order(state.inner(), user.id).await?;

    match order {
        Some(order) => {
            Ok(Json(PaymentIntentResponse{
            client_secret: order.client_secret,
            id: order.stripe_id
        }))},
        None => {
            let order = create_order(cart.id, state.inner(), user.id).await?;
            Ok(Json(order))
        }
}  
}

#[post("/webhook", data="<event>")]
async fn webhook(state: &State<AppState>, event: Json<EventObject>) -> Result<Status, AppError> {
    println!("EVENT HANDLER HIT");

    let stripe_id = &event.data.object.id;
    let event_type = &event.r#type;

    if event_type == "payment_intent.succeeded" {
        let mut tx = state.pool.begin().await?;
        let order = sqlx::query!(
            r#"
            UPDATE orders
            SET status = 'SUCCESS'
            WHERE
                stripe_id = $1
            RETURNING
                cart_id
            "#,
            stripe_id
        )
        .fetch_one(&mut *tx)
        .await?;

        sqlx::query!(
            r#"
            UPDATE carts
            SET status = 'CHECKED_OUT'
            WHERE
                id = $1
            "#,
            order.cart_id
        )
        .execute(&mut *tx)
        .await?;

        tx.commit().await?;

    } else if event_type == "payment_intent.payment_failed" {
        sqlx::query!(
            r#"
            UPDATE orders
            SET status = 'FAILED'
            WHERE
                stripe_id = $1
            "#,
            stripe_id
        )
        .execute(&state.pool)
        .await?;
    }
    Ok(Status { code: 200 })
}
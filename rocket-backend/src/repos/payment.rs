use bigdecimal::BigDecimal;
use crate::{AppState, errors::AppError, models::payment::{Order, OrderStatus}};

pub async fn save_order(state: &AppState, stripe_id: &str, user_id: i32, cart_id: i32, total_amount: &BigDecimal, client_secret: &str) -> Result<(), AppError> {
    sqlx::query!(
        r#"
        INSERT INTO orders (stripe_id, user_id, cart_id, status, total_amount, client_secret)
        VALUES ($1, $2, $3, $4, $5, $6)
        "#,
        stripe_id,
        user_id,
        cart_id,
        OrderStatus::Pending as OrderStatus,
        total_amount,
        client_secret
        )
        .execute(&state.pool)
        .await?;

    Ok(())
}

pub async fn get_order(state: &AppState, user_id: i32) -> Result<Option<Order>, AppError> {
    let order = sqlx::query_as!(Order,
    r#"
    SELECT 
        id, 
        stripe_id,
        client_secret,
        user_id,
        cart_id,
        status as "status: OrderStatus",
        total_amount,
        created_at
    FROM orders
    WHERE user_id = $1 AND status = 'PENDING'
    "#,
    user_id
    )
    .fetch_optional(&state.pool)
    .await?;

    Ok(order)

}
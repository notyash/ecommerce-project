use bigdecimal::BigDecimal;

use crate::{AppState, errors::AppError, models::payment::{Order, OrderStatus}};

pub async fn create_order(state: &AppState, stripe_id: &str, user_id: i32, cart_id: i32, total_amount: &BigDecimal) -> Result<(), AppError> {
    sqlx::query!(
        r#"
        INSERT INTO orders (stripe_id, user_id, cart_id, status, total_amount)
        VALUES ($1, $2, $3, $4, $5)
        "#,
        stripe_id,
        user_id,
        cart_id,
        OrderStatus::Pending as OrderStatus,
        total_amount
        )
        .execute(&state.pool)
        .await?;

    Ok(())
}

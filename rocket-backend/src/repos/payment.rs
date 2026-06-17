use bigdecimal::BigDecimal;
use crate::{AppState, dto::payment::Currency, errors::AppError, models::payment::{Order, OrderStatus}};

pub async fn save_order(state: &AppState, stripe_id: &str, user_id: i32, cart_id: i32, total_amount: &BigDecimal, currency: Currency) -> Result<(), AppError> {
    sqlx::query!(
        r#"
        INSERT INTO orders (stripe_id, user_id, cart_id, status, total_amount, currency)
        VALUES ($1, $2, $3, $4, $5, $6)
        "#,
        stripe_id,
        user_id,
        cart_id,
        OrderStatus::Pending as OrderStatus,
        total_amount,
        currency as Currency
        )
        .execute(&state.pool)
        .await?;

    Ok(())
}

pub async fn get_pending_order(state: &AppState, user_id: i32, cart_id: i32) -> Result<Option<Order>, AppError> {
    let order = sqlx::query_as!(Order,
    r#"
    SELECT 
        id, 
        stripe_id,
        user_id,
        cart_id,
        status as "status: OrderStatus",
        total_amount,
        created_at,
        currency as "currency: Currency"
    FROM orders
    WHERE user_id = $1
    AND cart_id = $2
    AND status = 'PENDING'
    "#,
    user_id,
    cart_id,
    )
    .fetch_optional(&state.pool)
    .await?;

    Ok(order)
}

pub async fn mark_existing_order_cancelled(state: &AppState, user_id: i32, cart_id: i32, stripe_id: &str) -> Result<(), AppError> {
    sqlx::query!(
        r#"
        UPDATE orders
        set status = 'CANCELLED'
        WHERE
            user_id = $1 AND
            cart_id = $2 AND
            stripe_id = $3 AND
            status = 'PENDING'
        "#,
        user_id,
        cart_id,
        stripe_id
    )
    .execute(&state.pool)
    .await?;

    Ok(())
}

pub async fn update_order_succeeded(stripe_id: &str, state: &AppState) -> Result<(), AppError> {
    let mut tx = state.pool.begin().await?;
    let order = sqlx::query!(
        r#"
        UPDATE orders
        SET status = 'SUCCESS'
        WHERE stripe_id = $1
        AND status = 'PENDING'
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

    Ok(())
}

pub async fn update_order_failed(stripe_id: &str, state: &AppState) -> Result<(), AppError> {
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

    Ok(())
}
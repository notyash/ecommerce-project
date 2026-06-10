use crate::{AppState, dto::cart::AllProductsInCart, errors::AppError, models::cart::{Cart, CartStatus, TotalPriceOfCart}};

pub async fn get_existing_cart(user_id: i32, state: &AppState) -> Result<Cart, AppError> {
    let cart = sqlx::query_as!(Cart, 
    r#"SELECT 
        id,
        user_id,
        status as "status: CartStatus",
        created_at 
    FROM carts 
    WHERE user_id = $1 AND status = 'ACTIVE' 
    "#,
    user_id)
    .fetch_optional(&state.pool)
    .await?;

    match cart {
        Some(cart) => Ok(cart),
        None => Err(AppError::NotFound("Cart not found".to_string()))
    }
}

pub async fn get_or_create_cart(user_id: i32, state: &AppState) -> Result<Cart, AppError> {
    let cart = sqlx::query_as!(Cart, 
        r#"SELECT 
            id,
            user_id,
            status as "status: CartStatus",
            created_at 
        FROM carts 
        WHERE user_id = $1 AND status = 'ACTIVE' 
        "#,
        user_id)
        .fetch_optional(&state.pool)
        .await?;
    
    match cart {
        Some(cart) => { Ok(cart) },
        None => { 
            let cart = sqlx::query_as!(Cart,
            r#"
            INSERT INTO carts (user_id, status)
            VALUES ($1, $2)
            RETURNING
                id,
                user_id,
                status as "status: CartStatus",
                created_at
            "#,
            user_id,
            CartStatus::Active as CartStatus)
            .fetch_one(&state.pool)
            .await?;

            Ok(cart)
            }
        }

}

pub async fn upsert_new_product(cart_id: i32, product_id: i32, quantity: i32, current_price: bigdecimal::BigDecimal, state: &AppState) -> Result<(), AppError> {
    sqlx::query!(
        r#"
        INSERT INTO cart_items (cart_id, product_id, quantity, current_price)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (cart_id, product_id)
        DO UPDATE SET 
            quantity = cart_items.quantity + EXCLUDED.quantity,
            current_price = EXCLUDED.current_price
        "#,
        cart_id,
        product_id,
        quantity,
        current_price)
        .execute(&state.pool)
        .await?;

    Ok(())
}

pub async fn get_product_price(product_id: i32, state: &AppState) -> Result<bigdecimal::BigDecimal, AppError> {
    let price = sqlx::query_scalar!( // query_scalar because we are getting only one value
        r#"
        SELECT price
        FROM products
        WHERE id = $1
        "#,
        product_id)
        .fetch_one(&state.pool)
        .await?;

    Ok(price)
}

pub async fn get_all_products_in_cart(cart_id: i32, state: &AppState) -> Result<Vec<AllProductsInCart>, AppError> {
    let products_in_cart = sqlx::query_as!(AllProductsInCart,
        r#"
        SELECT 
            title,
            images as "images: sqlx::types::Json<Vec<String>>",
            cart_id,
            product_id,
            quantity,   
            current_price,
            stock,
            rating
        FROM cart_items JOIN products ON cart_items.product_id = products.id
        WHERE cart_id = $1 
        "#,
        cart_id)
        .fetch_all(&state.pool)
        .await?;
    
    Ok(products_in_cart)
}

pub async fn remove_product(product_id: i32, cart_id: i32, state: &AppState) -> Result<(), AppError> {
    sqlx::query!(
        r#"
        DELETE FROM cart_items
        WHERE cart_id = $1 AND product_id = $2
        "#,
        cart_id,
        product_id)
        .execute(&state.pool)
        .await?;

    Ok(())
}

pub async fn remove_one_product_quantity(product_id: i32, cart_id: i32, state: &AppState) -> Result<(), AppError> {
    let result = sqlx::query!(
        r#"
        UPDATE cart_items
        SET quantity = quantity - 1
        WHERE 
            cart_id = $1 
            AND product_id = $2
            AND quantity > 1
        "#,
        cart_id,
        product_id
    )
    .execute(&state.pool)
    .await?;

    if result.rows_affected() == 0 {
        remove_product(product_id, cart_id, state).await?;
    }

    Ok(())
}

pub async fn get_all_prices_and_quantity_in_cart(cart_id: i32, state: &AppState) -> Result<Vec<TotalPriceOfCart>, AppError> {
    let prices_and_quantity = sqlx::query_as!(TotalPriceOfCart,
        r#"
        SELECT current_price, quantity from cart_items
        WHERE cart_id = $1
        "#,
        cart_id
        )
        .fetch_all(&state.pool)
        .await?;

    Ok(prices_and_quantity)
}
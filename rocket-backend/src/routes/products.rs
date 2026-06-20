use rocket::serde::json::Json;
use rocket::{State};
use crate::AppState;
use crate::dto::payment::{Currency};
use crate::errors::AppError;
use crate::models::Product;
use crate::services::payment::convert_usd_to_inr;

pub fn routes() -> Vec<rocket::Route> {
    routes![list_products, product_by_id]
}

#[get("/?<currency>")]
pub async fn list_products(state: &State<AppState>, currency: Currency) -> Result<Json<Vec<Product>>, AppError> {
    let mut products = sqlx::query_as!(
        Product,
        "SELECT * FROM products ORDER BY created_at DESC"
        )
        .fetch_all(&state.pool)
        .await
        .unwrap();
    
    match currency {
        Currency::Inr => { 
            let conversion_rate = &state.inner().config.usd_to_inr_rate;
            for product in products.iter_mut() {
                product.price = convert_usd_to_inr(conversion_rate, product.price.clone());
            }
            Ok(Json(products))
         },
        Currency::Usd => { Ok(Json(products)) }
    }
}

#[get("/<id>?<currency>")]
pub async fn product_by_id(state: &State<AppState>, id: i32, currency: Currency) -> Result<Json<Product>, AppError> {
    let mut product = sqlx::query_as!(
        Product,
        "SELECT * FROM products WHERE id = $1", id
        )
        .fetch_one(&state.pool)
        .await
        .unwrap();

    match currency {
        Currency::Inr => { 
            let conversion_rate = &state.inner().config.usd_to_inr_rate;
            product.price = convert_usd_to_inr(conversion_rate, product.price.clone());
            Ok(Json(product))
         },
        Currency::Usd => { Ok(Json(product)) }
    }
}
use rocket::serde::json::Json;
use rocket::State;
use crate::db::DbPool;
use crate::models::Product;

pub fn routes() -> Vec<rocket::Route> {
    routes![list_products, product_by_id]
}

#[get("/")]
pub async fn list_products(db: &State<DbPool>) -> Json<Vec<Product>> {
    let products = sqlx::query_as!(
        Product,
        "SELECT * FROM products ORDER BY created_at DESC"
        )
        .fetch_all(db.inner())
        .await
        .unwrap();
    Json(products)
}

#[get("/<id>")]
pub async fn product_by_id(db: &State<DbPool>, id: i32) -> Json<Product> {
    let product = sqlx::query_as!(
        Product,
        "SELECT * FROM products WHERE id = $1", id
        )
        .fetch_one(db.inner())
        .await
        .unwrap();

    Json(product)
}
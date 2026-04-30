use chrono::{DateTime, Utc};

#[derive(serde::Serialize, sqlx::FromRow)]
pub struct Product {
    pub id: i32,
    pub title: String,
    pub description: Option<String>, 
    pub price: bigdecimal::BigDecimal,
    pub stock: i32,
    pub created_at: DateTime<Utc>,
    pub category: String,
    pub brand: Option<String>,
    pub rating: Option<f64>,
    pub discount_percentage: Option<f64>,
    pub thumbnail: Option<String>,
    pub images: serde_json::Value,
    pub tags: serde_json::Value,
    pub reviews: Option<serde_json::Value>,
    pub minimum_order_quantity: Option<i32>,
    pub availability_status: String,
    pub return_policy: String,
    pub warranty_information: Option<String>,
    pub shipping_information: Option<String>,
    pub dimensions: Option<serde_json::Value>,
    pub meta: Option<serde_json::Value>,
    pub sku: Option<String>,
    pub weight: i32,
    
}
use serde::{Deserialize, Serialize};

#[derive(Debug, sqlx::Type, Serialize, Deserialize)]
#[sqlx(type_name = "order_status")]
pub enum OrderStatus {
    #[sqlx(rename="PENDING")]
    Pending,
    #[sqlx(rename="SUCCESS")]
    Success,
    #[sqlx(rename="FAILED")]
    Failed,
}

#[derive(Debug, Serialize)]
pub struct Order {
    pub id: i32,
    pub stripe_id: String,
    pub user_id: i32,
    pub cart_id: i32,
    pub status: OrderStatus,
    pub total_amount: bigdecimal::BigDecimal,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

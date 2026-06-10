use serde::Serialize;


#[derive(Debug, sqlx::Type, Serialize)]
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
    pub stripe_id: Option<String>,
    pub user_id: i32,
    pub cart_id: i32,
    pub status: OrderStatus,
    pub total_amount: i32,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

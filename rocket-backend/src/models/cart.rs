
#[derive(Debug, sqlx::Type)]
#[sqlx(type_name = "cart_status")]
pub enum CartStatus {
    #[sqlx(rename="ACTIVE")]
    Active,
    #[sqlx(rename="CHECKED_OUT")]
    CheckedOut,
    #[sqlx(rename="ABANDONED")]
    Abandoned,
    #[sqlx(rename="DELETED")]
    Deleted
}

pub struct Cart {
    pub id: i32,
    pub user_id: i32,
    pub status: CartStatus,
    pub created_at: chrono::DateTime<chrono::Utc>
}

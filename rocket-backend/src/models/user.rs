#[derive(Debug, serde::Serialize, sqlx::FromRow)]
pub struct User {
    pub id: i32,
    pub google_id: Option<String>,
    pub email: String,
    pub full_name: String,
    pub avatar_url: Option<String>,
    pub role: String,
    pub is_active: bool,
    pub created_at: chrono::DateTime<chrono::Utc>,
}
use crate::dto::auth::UserDto;

#[derive(Debug, serde::Serialize, sqlx::FromRow)]
pub struct User {
    pub id: i32,
    pub password_hash: String,
    pub google_id: Option<String>,
    pub email: String,
    pub full_name: String,
    pub avatar_url: Option<String>,
    pub role: String,
    pub is_active: bool,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

impl User {
    pub fn to_dto(&self, backup_url: &str) -> UserDto {
        UserDto {
            id: self.id,
            email: self.email.clone(),
            name: self.full_name.clone(),
            picture: self.avatar_url.as_deref().unwrap_or(backup_url).to_string(),
            role: self.role.clone(),
            is_active: self.is_active,
            created_at: self.created_at,
        }
    }
}
use crate::{AppState, dto::auth::UserDto};

#[derive(Debug, sqlx::FromRow)]
pub struct AuthUser {
    pub id: i32,
    pub password_hash: Option<String>,
    pub username: Option<String>,
    pub google_id: Option<String>,
    pub email: String,
    pub full_name: String,
    pub avatar_url: Option<String>,
    pub role: String,
    pub is_active: bool,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, serde::Serialize, sqlx::FromRow)]
pub struct User {
    pub id: i32,
    pub username: Option<String>,
    pub google_id: Option<String>,
    pub email: String,
    pub full_name: String,
    pub avatar_url: Option<String>,
    pub role: String,
    pub is_active: bool,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

impl From<AuthUser> for User {
    fn from(user: AuthUser) -> Self {
        User {
            id: user.id,
            username: user.username,
            google_id: user.google_id,
            email: user.email,
            full_name: user.full_name,
            avatar_url: user.avatar_url,
            role: user.role,
            is_active: user.is_active,
            created_at: user.created_at,
        }
    }

}

impl User {
    pub fn to_dto(&self, state: &AppState) -> UserDto {
        let backup_url = &state.config.backup_avatar;
        UserDto {
            id: self.id,
            username: self.username.as_deref().unwrap_or("User").to_string(), //as_deref converts Option(String) to Option(&str) here
            email: self.email.clone(),
            name: self.full_name.clone(),
            picture: self.avatar_url.as_deref().unwrap_or(backup_url).to_string(),
            role: self.role.clone(),
            is_active: self.is_active,
            created_at: self.created_at,
        }
    }
} 
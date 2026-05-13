use crate::{AppState, errors::{AppError, AuthErrors}, models::user::{User, AuthUser}};

pub async fn get_user_by_email_with_password(email: &str, state: &AppState) -> Result<AuthUser, AppError> {
        let user = sqlx::query_as!(AuthUser,
        r#"SELECT id, google_id, password_hash, email, full_name, avatar_url, role, is_active, created_at 
            FROM users WHERE
            email = $1 AND password_hash IS NOT NULL"#, 
        email)
        .fetch_one(&state.pool)
        .await
        .map_err(|_| AppError::Authorization(AuthErrors::InvalidCredentials))?;

    Ok(user)
}

pub async fn get_public_user_by_id(user_id: i32, state: &AppState) -> Result<User, AppError> {
        let user_record = sqlx::query_as!(User,
        "SELECT id, google_id, email, full_name, avatar_url, role, is_active, created_at FROM users WHERE id = $1", user_id)
        .fetch_one(&state.pool).await?;

    Ok(user_record)
}

pub async fn upsert_google_user(state: &AppState, google_id: &str, email: &str, name: &str, picture: &str) -> Result<User, AppError> {
    let user = sqlx::query_as!(User,
        r#"
        INSERT INTO users (google_id, email, full_name, avatar_url, role, is_active)
        VALUES ($1, $2, $3, $4, 'user', true)
        ON CONFLICT (email)
        DO UPDATE SET 
            google_id = COALESCE(users.google_id, EXCLUDED.google_id),
            full_name = EXCLUDED.full_name,
            avatar_url = EXCLUDED.avatar_url
        RETURNING 
            id, 
            google_id as "google_id?", 
            email, 
            full_name, 
            avatar_url as "avatar_url?", 
            role, 
            is_active, 
            created_at
        "#, 
        google_id,
        email,
        name,
        picture
    ).fetch_one(&state.pool)
    .await?;

    Ok(user)
}

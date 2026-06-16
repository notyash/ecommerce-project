use bigdecimal::BigDecimal;

pub struct Config {
    pub database_url: String,
    pub jwt_secret: String,
    pub oauth_secret: String,
    pub oauth_client: String,
    pub oauth_redirect_uri: String,
    pub jwks_uri: String,
    pub backup_avatar: String,
    pub session_duration: i64,
    pub stripe_secret: String,
    pub usd_to_inr_rate: BigDecimal,
}

impl Config {
    pub fn from_env() -> Self {
        dotenvy::dotenv().ok();
        let session_duration = std::env::var("SESSION_DURATION")
        .unwrap_or_else(|_| "86400".to_string())
        .parse::<i64>()
        .unwrap_or(86400);
        Config { database_url: std::env::var("DATABASE_URL").expect("DATABASE_URL must be set"),
                 jwt_secret: std::env::var("JWT_SECRET").expect("JWT_SECRET must be set"),
                 oauth_client: std::env::var("OAUTH_CLIENT_ID").expect("OAUTH_CLIENT_ID must be set"),
                 oauth_secret: std::env::var("OAUTH_CLIENT_SECRET").expect("OAUTH_CLIENT_SECRET must be set"),
                 oauth_redirect_uri: std::env::var("OAUTH_REDIRECT_URI").expect("OAUTH_REDIRECT_URI must be set"),
                 jwks_uri: std::env::var("JWKS_URI").expect("JWKS_URI must be set"),
                 session_duration,
                 backup_avatar: std::env::var("BACKUP_AVATAR").expect("BACKUP_AVATAR must be set"),
                 stripe_secret: std::env::var("STRIPE_SECRET").expect("STRIPE_SECRET must be set"),
                 usd_to_inr_rate: std::env::var("USD_TO_INR_RATE").expect("USD_TO_INR_RATE must be set").parse::<BigDecimal>().expect("USD_TO_INR_RATE must be a valid number")
        }
    }
}
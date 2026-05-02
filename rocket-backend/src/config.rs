pub struct Config {
    pub database_url: String,
    pub jwt_secret: String,
    pub oauth_secret: String,
    pub oauth_client: String,
    pub oauth_redirect_uri: String,
}

impl Config {
    pub fn from_env() -> Self {
        dotenvy::dotenv().ok();

        Config { database_url: std::env::var("DATABASE_URL").expect("DATABASE_URL must be set"),
                 jwt_secret: std::env::var("JWT_SECRET").expect("JWT_SECRET must be set"),
                 oauth_client: std::env::var("OAUTH_CLIENT_ID").expect("OAUTH_CLIENT_ID must be set"),
                 oauth_secret: std::env::var("OAUTH_CLIENT_SECRET").expect("OAUTH_CLIENT_SECRET must be set"),
                 oauth_redirect_uri: std::env::var("OAUTH_REDIRECT_URI").expect("OAUTH_REDIRECT_URI must be set"),
        }
    }
}
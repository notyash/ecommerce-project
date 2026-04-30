#[macro_use]
extern crate rocket;

mod config;
mod db;
mod dto;
mod errors;
mod models;
mod routes;
mod guards;

use config::Config;

#[launch]
async fn rocket() -> _ {
    let config = Config::from_env();
    let pool = db::connect(&config.database_url).await;

    rocket::build()
        .manage(pool)
        .manage(config)
        // .mount("/auth", routes::auth::routes())
        // .mount("/users", routes::users::routes())
        .mount("/products", routes::products::routes())
}
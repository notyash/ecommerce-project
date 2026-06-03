#[macro_use]
extern crate rocket;

mod config;
mod db;
mod dto;
mod errors;
mod models;
mod routes;
mod guards;
mod fairings;
mod utils;
mod repos;
mod services;

use config::Config;
use reqwest::Client;
use crate::{db::DbPool, errors::default_catcher, fairings::CorsFairing};

#[get("/")]
fn index() -> &'static str {
    "Hello Yash"
}
struct AppState {
    pool: DbPool,
    config: Config,
    client: Client,
}

#[rocket::main]
async fn main() {
    let config = Config::from_env();
    let pool = db::connect(&config.database_url).await;
    let client = Client::new();

    rocket::build()
        .manage(AppState {
            pool, 
            config,
            client,
        })
        .mount("/api/auth", routes::auth::routes())
        // .mount("/users", routes::users::routes())
        .mount("/", routes![index])
        .mount("/api/products", routes::products::routes())
        .mount("/api/cart", routes::cart::routes())
        .attach(CorsFairing::new(&[
            "http://127.0.0.1:5173", "http://localhost:5173", "http://frontend:5173"
        ]))
        .register("/", catchers![default_catcher])
        .launch()
        .await
        .unwrap();
}
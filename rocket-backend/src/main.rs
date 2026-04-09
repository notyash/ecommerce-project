#[macro_use] extern crate rocket;

mod config;
mod db;
mod dto;
mod errors;
mod models;
mod routes;
mod guards;

use dotenv::dotenv;

#[launch]
async fn rocket() -> _ {
    dotenv().ok();

    let pool = db::init_pool().await.expect("Failed to connect to DB");

    rocket::build()
        .manage(pool)
        .mount("/auth", routes::auth::routes())
        .mount("/users", routes::users::routes())
        .mount("/products", routes::products::routes())
}
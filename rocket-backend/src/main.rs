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

use config::Config;
use crate::fairings::CorsFairing;

#[get("/")]
fn index() -> &'static str {
    "Hello Yash"
}

#[launch]
async fn rocket() -> _ {
    let config = Config::from_env();
    let pool = db::connect(&config.database_url).await;

    rocket::build()
        .manage(pool)
        .manage(config)
        .mount("/auth", routes::auth::routes())
        // .mount("/users", routes::users::routes())
        .mount("/", routes![index])
        .mount("/products", routes::products::routes())
        .attach(CorsFairing::new(&[
            "http://127.0.0.1:5173", "http://localhost:5173"
        ]))
}
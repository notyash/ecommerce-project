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
use rocket::http::Status;

use crate::fairings::CorsFairing;

#[options("/<_..>")]
fn options() -> Status {
    Status::NoContent
}

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
        // .mount("/auth", routes::auth::routes())
        // .mount("/users", routes::users::routes())
        .mount("/", routes![index, options])
        .mount("/products", routes::products::routes())
        .attach(CorsFairing::new(&[
            "http://localhost:5173/"
        ]))
}
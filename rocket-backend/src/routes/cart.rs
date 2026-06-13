use rocket::{State, http::Status, serde::json::Json};
use crate::{AppState, dto::{auth::AuthenticatedUser, cart::{AllProductsInCart, ItemToAdd, ItemToRemove}}, errors::AppError,
 repos::{cart::{get_all_products_in_cart, get_existing_cart, get_or_create_cart, get_product_price, decrement_product_quantity, remove_product, upsert_new_product}}, 
 services::{cart::invalidate_pending_checkout_if_exists}};

pub fn routes() -> Vec<rocket::Route> {
    routes![add_product_to_cart, remove_product_from_cart, get_all_items_in_cart, decrement_product_in_cart]
}

#[get("/items")]
async fn get_all_items_in_cart(user: AuthenticatedUser, state: &State<AppState>) -> Result<Json<Vec<AllProductsInCart>>, AppError> {
    let user_id = user.id;
    let cart = get_or_create_cart(user_id, state.inner()).await?;
    let products_in_cart = get_all_products_in_cart(cart.id, state).await?;
    Ok(Json(products_in_cart))
}

#[post("/add", data="<item>")]
async fn add_product_to_cart(user: AuthenticatedUser, item: Json<ItemToAdd>, state: &State<AppState>) -> Result<Status, AppError> {
    let user_id = user.id;
    let cart = get_or_create_cart(user_id, state.inner()).await?;
    let current_price = get_product_price(item.product_id, state.inner()).await?;

    upsert_new_product(cart.id, item.product_id, item.quantity, current_price, state.inner()).await?;
    let status = invalidate_pending_checkout_if_exists(state.inner(), user_id, cart.id).await?;

    Ok(status)

}

#[post("/remove", data="<item>")]
async fn remove_product_from_cart(user: AuthenticatedUser, item: Json<ItemToRemove>, state: &State<AppState>) -> Result<Status, AppError> {
    let user_id = user.id;
    let cart = get_existing_cart(user_id, state.inner()).await?;
    remove_product(item.product_id, cart.id, state.inner()).await?;
    let status = invalidate_pending_checkout_if_exists(state.inner(), user_id, cart.id).await?;

    Ok(status)
}

#[post("/decrement", data="<item>")]
async fn decrement_product_in_cart(user: AuthenticatedUser, item: Json<ItemToRemove>, state: &State<AppState>) -> Result<Status, AppError> {
    let user_id = user.id;
    let cart = get_existing_cart(user_id, state.inner()).await?;
    decrement_product_quantity(item.product_id, cart.id, state.inner()).await?;
    let status = invalidate_pending_checkout_if_exists(state.inner(), user_id, cart.id).await?;

    Ok(status)
}


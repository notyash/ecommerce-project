use rocket::{State, http::Status, serde::json::Json};
use crate::{AppState, dto::{auth::AuthenticatedUser, cart::{AllProductsInCart, ItemToModify}, payment::Currency}, errors::AppError,
 repos::cart::{decrement_product_quantity, get_all_products_in_cart, get_existing_cart, get_or_create_cart, get_product_price, remove_product, upsert_new_product}, 
 services::{cart::invalidate_pending_checkout_if_exists, payment::convert_usd_to_inr}};

pub fn routes() -> Vec<rocket::Route> {
    routes![add_product_to_cart, remove_product_from_cart, get_all_items_in_cart, decrement_product_in_cart]
}

#[get("/items?<currency>")]
async fn get_all_items_in_cart(user: AuthenticatedUser, state: &State<AppState>, currency: Currency) -> Result<Json<Vec<AllProductsInCart>>, AppError> {
    let user_id = user.id;
    let cart = get_or_create_cart(user_id, state.inner()).await?;
    let mut products_in_cart = get_all_products_in_cart(cart.id, state).await?;
    match currency {
        Currency::Inr => { 
            let conversion_rate = &state.inner().config.usd_to_inr_rate;
            for product in products_in_cart.iter_mut() {
                product.current_price = convert_usd_to_inr(conversion_rate, product.current_price.clone());
            }
            Ok(Json(products_in_cart))
         },
        Currency::Usd => { Ok(Json(products_in_cart)) }
    }
}

#[post("/add", data="<item>")]
async fn add_product_to_cart(user: AuthenticatedUser, item: Json<ItemToModify>, state: &State<AppState>) -> Result<Status, AppError> {
    let user_id = user.id;
    let cart = get_or_create_cart(user_id, state.inner()).await?;
    let current_price = get_product_price(item.product_id, state.inner()).await?;
    let quantity = item.quantity.unwrap_or(1);
    let status = invalidate_pending_checkout_if_exists(state.inner(), user_id, cart.id).await?;
    upsert_new_product(cart.id, item.product_id, quantity, current_price, state.inner()).await?;

    Ok(status)
}

#[post("/remove", data="<item>")]
async fn remove_product_from_cart(user: AuthenticatedUser, item: Json<ItemToModify>, state: &State<AppState>) -> Result<Status, AppError> {
    let user_id = user.id;
    let cart = get_existing_cart(user_id, state.inner()).await?;
    let status = invalidate_pending_checkout_if_exists(state.inner(), user_id, cart.id).await?;
    remove_product(item.product_id, cart.id, state.inner()).await?;

    Ok(status)
}

#[post("/decrement", data="<item>")]
async fn decrement_product_in_cart(user: AuthenticatedUser, item: Json<ItemToModify>, state: &State<AppState>) -> Result<Status, AppError> {
    let user_id = user.id;
    let cart = get_existing_cart(user_id, state.inner()).await?;
    let status = invalidate_pending_checkout_if_exists(state.inner(), user_id, cart.id).await?;
    decrement_product_quantity(item.product_id, cart.id, state.inner()).await?;

    Ok(status)
}


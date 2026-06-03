use rocket::{State, serde::json::Json};
use crate::{AppState, dto::{auth::AuthenticatedUser, cart::{AllProductsInCart, ItemToAdd}}, errors::AppError, 
            repos::cart::{get_all_products_in_cart, get_or_create_cart, get_product_price, upsert_new_product}};

pub fn routes() -> Vec<rocket::Route> {
    routes![add_to_cart]
}

#[post("/add", data="<item>")]
async fn add_to_cart(user: AuthenticatedUser, item: Json<ItemToAdd>, state: &State<AppState>) -> Result<Json<Vec<AllProductsInCart>>, AppError> {
    let user_id = user.id;
    let cart = get_or_create_cart(user_id, state.inner()).await?;
    let current_price = get_product_price(item.product_id, state.inner()).await?;
    upsert_new_product(cart.id, item.product_id, item.quantity, current_price, state).await?;
    let products_in_cart = get_all_products_in_cart(cart.id, state).await?;

    Ok(Json(products_in_cart))
}


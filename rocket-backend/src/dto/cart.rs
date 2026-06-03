use serde::{Deserialize, Serialize};


#[derive(Deserialize)]
pub struct ItemToAdd {
    pub product_id: i32,
    pub quantity: i32
}

#[derive(Serialize)]
pub struct AllProductsInCart {
    pub title: String,
    pub cart_id: i32,
    pub product_id: i32,
    pub quantity: i32,
    pub current_price: bigdecimal::BigDecimal
}
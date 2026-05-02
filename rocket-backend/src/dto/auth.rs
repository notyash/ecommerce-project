use serde::{Deserialize, Serialize};


#[derive(Deserialize, Serialize)]
pub struct OAuth {
    pub code: String,
}

#[derive(Deserialize, Serialize)]
pub struct JWT {
    pub token: String, 
}
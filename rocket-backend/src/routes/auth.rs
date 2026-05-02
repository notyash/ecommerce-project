use crate::db::DbPool;


pub fn routes() -> Vec<rocket::Route> {
    routes![signup]
}

#[post("/signup")]
async fn signup() {

}
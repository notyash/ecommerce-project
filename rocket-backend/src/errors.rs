use rocket::Request;
use rocket::http::Status;   

#[catch(default)]
fn default_catcher(status: Status, request: &Request) -> String { 
    format!("Something went wrong while trying to access this url: '{}'\nStatus: {}", request.uri(), status.code)
}

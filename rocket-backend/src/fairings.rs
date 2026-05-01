use rocket::{Build, Request, Response, Rocket, fairing::{self, Fairing, Info, Kind}};
use rocket::http::{Header, Method, Status};

pub struct CorsFairing {
    allowed_origins: &'static [&'static str],
}

impl CorsFairing {
    pub fn new(allowed_origins: &'static [&'static str]) -> Self {
        Self {
            allowed_origins
        }
    }
}
    
#[rocket::async_trait]
impl Fairing for CorsFairing {
    fn info(&self) -> Info {
        Info { name: "CORS", kind: Kind::Ignite | Kind::Response}
    }

    async fn on_ignite(&self, rocket: Rocket<Build>) -> fairing::Result {
        if self.allowed_origins.is_empty() {
            eprintln!("CORS: allowed_origins cannot be empty");
            return Err(rocket);
        }

        for origin in self.allowed_origins {
            if origin.is_empty() || !origin.starts_with("http") {
                eprintln!("CORS: invalid origin '{}'", origin);
                return Err(rocket);
            }   
            println!("CORS: allowing origin -> {}", origin);
        }

        Ok(rocket)
    }

    async fn on_response<'r>(&self, request: &'r Request<'_>, response: &mut Response<'r>) {
        let Some(request_origin ) = request.headers().get_one("Origin") else {
            return;
        };

        let is_allowed = self.allowed_origins.iter().any(|o| *o == request_origin);
        if !is_allowed {
            return;
        }
        
        response.set_header(Header::new("Access-Control-Allow-Origin", request_origin.to_string()));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
        response.set_header(Header::new("Vary", "Origin"));

        if request.method() == Method::Options {
            response.set_status(Status::NoContent);
            
            response.set_header(Header::new("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS"));
            response.set_header(Header::new("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept, X-Requested-With"));
            response.set_header(Header::new("Access-Control-Max-Age", "86400"));

            response.set_sized_body(0, std::io::Cursor::new(""));
        }
    }

}
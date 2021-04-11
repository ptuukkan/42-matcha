use crate::application::heartbeat::MyWebSocket;
use actix_web::HttpRequest;
use actix_web::error::Error;
use actix_web::{get, web, HttpResponse};
use actix_web_actors::ws;

#[get("/ws/heartbeat")]
async fn heartbeat(req: HttpRequest, stream: web::Payload) -> Result<HttpResponse, Error> {
    println!("{:?}", req);
    let res = ws::start(MyWebSocket::new(), &req, stream);
    println!("{:?}", res);
    res
}

pub fn routes(config: &mut web::ServiceConfig) {
	config.service(heartbeat);
}

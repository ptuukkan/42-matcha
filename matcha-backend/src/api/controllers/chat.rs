use crate::application::chat;
use crate::chat::client::WsSession;
use crate::chat::server::WsServer;
use crate::models::user::User;
use actix::*;
use actix_web::{get, web, Error, HttpRequest, HttpResponse, web::Path};
use actix_web_actors::ws;
use std::time::Instant;

#[get("/ws/chat")]
async fn chat_route(
	req: HttpRequest,
	stream: web::Payload,
	ws_srv: web::Data<Addr<WsServer>>,
) -> Result<HttpResponse, Error> {
	ws::start(
		WsSession {
			hb: Instant::now(),
			ws_srv: ws_srv.get_ref().clone(),
			profile_key: None,
		},
		&req,
		stream,
	)
}

#[get("/api/chat")]
async fn get_all(user: User) -> Result<HttpResponse, Error> {
	let chats = chat::get_all(user).await?;
	Ok(HttpResponse::Ok().json(chats))
}

#[get("/api/chat/{id}")]
async fn read(user: User, Path(id): Path<String>) -> Result<HttpResponse, Error> {
	chat::read(user, id).await?;
	Ok(HttpResponse::Ok().finish())
}

pub fn routes(config: &mut web::ServiceConfig) {
	config.service(chat_route).service(get_all).service(read);
}

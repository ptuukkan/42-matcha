use crate::chat::WsChatSession;
use std::sync::{
	atomic::{AtomicUsize, Ordering},
	Arc,
};
use std::time::Instant;

use actix::*;

use actix_web::{get, web, Error, HttpRequest, HttpResponse, Responder};

use crate::application::chat;
use actix_web_actors::ws;

/// Entry point for our websocket route

#[get("/chat")]
async fn chat_route(
	req: HttpRequest,
	stream: web::Payload,
	srv: web::Data<Addr<chat::ChatServer>>,
) -> Result<HttpResponse, Error> {
	ws::start(
		WsChatSession {
			id: 0,
			hb: Instant::now(),
			name: None,
			addr: srv.get_ref().clone(),
		},
		&req,
		stream,
	)
}

pub fn routes(config: &mut web::ServiceConfig) {
	config.service(chat_route);
}

use crate::models::notification::NotificationDto;
use crate::application::profile;
use crate::chat;
use crate::chat::client::{JoinMessage, LeaveMessage, WsChatMessage, WsSession};
use actix::prelude::*;

struct WsSessionEntry {
	profile_key: String,
	ws_client: Addr<WsSession>,
}

pub struct WsServer {
	sessions: Vec<WsSessionEntry>,
}

impl WsServer {
	pub fn new() -> Self {
		Self {
			sessions: Vec::new(),
		}
	}
}

impl Actor for WsServer {
	type Context = Context<Self>;
}

impl Handler<JoinMessage> for WsServer {
	type Result = ();

	fn handle(&mut self, msg: JoinMessage, _ctx: &mut Self::Context) {
		let key = msg.profile_key;
		self.sessions.push(WsSessionEntry {
			profile_key: key.to_owned(),
			ws_client: msg.ws_client,
		});
		actix_web::rt::spawn(async move {
			let _ = profile::utils::set_online(&key).await;
		});
	}
}

impl Handler<LeaveMessage> for WsServer {
	type Result = ();

	fn handle(&mut self, msg: LeaveMessage, _ctx: &mut Self::Context) {
		self.sessions.retain(|x| x.profile_key != *msg.profile_key);
		actix_web::rt::spawn(async move {
			let _ = profile::utils::set_offline(&msg.profile_key).await;
		});
	}
}

impl Handler<WsChatMessage> for WsServer {
	type Result = ();

	fn handle(&mut self, msg: WsChatMessage, ctx: &mut Self::Context) {
		for session in &self.sessions {
			if session.profile_key == msg.to {
				session.ws_client.do_send(msg.to_owned());
			}
		}
		let addr = ctx.address();
		actix_web::rt::spawn(async move {
			let _ = chat::message(msg, addr).await;
		});
	}
}

impl Handler<NotificationDto> for WsServer {
	type Result = ();

	fn handle(&mut self, msg: NotificationDto, _ctx: &mut Self::Context) {
		for session in &self.sessions {
			if session.profile_key == msg.target_profile {
				session.ws_client.do_send(msg.to_owned());
			}
		}
	}
}

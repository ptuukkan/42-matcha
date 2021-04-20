use crate::application::profile;
use crate::chat;
use crate::chat::client::{JoinMessage, LeaveMessage, WsChatMessage, WsSession};
use actix::prelude::*;

struct WsSessionEntry {
	profile_key: String,
	addr: Addr<WsSession>,
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

	fn handle(&mut self, msg: JoinMessage, _ctx: &mut Context<Self>) {
		let key = msg.profile_key;
		self.sessions.push(WsSessionEntry {
			profile_key: key.to_owned(),
			addr: msg.addr,
		});
		actix_web::rt::spawn(async move {
			let _ = profile::utils::set_online(&key).await;
		});
	}
}

impl Handler<LeaveMessage> for WsServer {
	type Result = ();

	fn handle(&mut self, msg: LeaveMessage, _ctx: &mut Context<Self>) {
		self.sessions.retain(|x| x.profile_key != *msg.profile_key);
		actix_web::rt::spawn(async move {
			let _ = profile::utils::set_offline(&msg.profile_key).await;
		});
	}
}

impl Handler<WsChatMessage> for WsServer {
	type Result = ();

	fn handle(&mut self, msg: WsChatMessage, _ctx: &mut Context<Self>) {
		for session in &self.sessions {
			if session.profile_key == msg.to {
				session.addr.do_send(msg.to_owned());
			}
		}
		actix_web::rt::spawn(async move {
			let _ = chat::message(msg).await;
		});
	}
}

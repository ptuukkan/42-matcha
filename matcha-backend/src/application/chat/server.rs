use crate::chat::client::{JoinMessage, LeaveMessage, WsChatMessage, WsSession};
use crate::chat;
use crate::application::profile;
use actix::prelude::*;
use std::collections::HashMap;

pub struct WsServer {
	sessions: HashMap<String, Addr<WsSession>>,
}

impl WsServer {
	pub fn new() -> Self {
		Self {
			sessions: HashMap::new(),
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
		self.sessions.insert(key.to_owned(), msg.addr);
		actix_web::rt::spawn(async move {
			let _ = profile::utils::set_online(&key).await;
		});
	}
}

impl Handler<LeaveMessage> for WsServer {
	type Result = ();

	fn handle(&mut self, msg: LeaveMessage, _ctx: &mut Context<Self>) {
		self.sessions.remove(&msg.profile_key);
		actix_web::rt::spawn(async move {
			let _ = profile::utils::set_offline(&msg.profile_key).await;
		});
	}
}

impl Handler<WsChatMessage> for WsServer {
	type Result = ();

	fn handle(&mut self, msg: WsChatMessage, _ctx: &mut Context<Self>) {
		if let Some(recipient) = self.sessions.get(&msg.to) {
			recipient.do_send(msg.to_owned());
		}
		actix_web::rt::spawn(async move {
			let _ = chat::message(msg).await;
		});
	}
}

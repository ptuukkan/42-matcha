use actix::prelude::*;
use rand::{self, rngs::ThreadRng, Rng};
use std::collections::{HashMap};
use super::client::{Message, Connect, Disconnect, ClientMessage};

pub struct ChatServer {
	sessions: HashMap<usize, Recipient<Message>>,
	rng: ThreadRng,
}

impl ChatServer {
	pub fn new() -> ChatServer {
		// default room

		ChatServer {
			sessions: HashMap::new(),
			rng: rand::thread_rng(),
		}
	}
	fn send_message(&self, message: &str) {
		for session in &self.sessions {
			let _ = session.1.do_send(Message(message.to_owned()));
		}
	}
}


impl Actor for ChatServer {

	type Context = Context<Self>;
}

impl Handler<Connect> for ChatServer {
	type Result = usize;

	fn handle(&mut self, msg: Connect, _: &mut Context<Self>) -> Self::Result {
		println!("Someone joined");

		self.send_message("Someone joined");
		let id = self.rng.gen::<usize>();
		self.sessions.insert(id, msg.addr);
		id
	}
}

impl Handler<Disconnect> for ChatServer {
	type Result = ();

	fn handle(&mut self, msg: Disconnect, _: &mut Context<Self>) {
		println!("Someone disconnected");
		self.sessions.remove(&msg.id);
	}
}

impl Handler<ClientMessage> for ChatServer {
	type Result = ();

	fn handle(&mut self, msg: ClientMessage, _: &mut Context<Self>) {
		self.send_message(msg.msg.as_str());
	}
}


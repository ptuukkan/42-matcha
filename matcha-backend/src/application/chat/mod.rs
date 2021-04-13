//! `ChatServer` is an actor. It maintains list of connection client session.
//! And manages available rooms. Peers send messages to other peers in same
//! room through `ChatServer`.

use actix::prelude::*;
use rand::{self, rngs::ThreadRng, Rng};
use std::sync::{
	atomic::{AtomicUsize, Ordering},
	Arc,
};
use std::collections::{HashMap, HashSet};
use std::time::{Duration, Instant};
use actix_web_actors::ws;

/// How often heartbeat pings are sent
const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);
/// How long before lack of client response causes a timeout
const CLIENT_TIMEOUT: Duration = Duration::from_secs(10);

/// Chat server sends this messages to session
#[derive(Message)]
#[rtype(result = "()")]
pub struct Message(pub String);

/// Message for chat server communications

/// New chat session is created
#[derive(Message)]
#[rtype(usize)]
pub struct Connect {
	pub addr: Recipient<Message>,
}

/// Session is disconnected
#[derive(Message)]
#[rtype(result = "()")]
pub struct Disconnect {
	pub id: usize,
}

/// Send message to specific room
#[derive(Message)]
#[rtype(result = "()")]
pub struct ClientMessage {
	/// Id of the client session
	pub id: usize,
	/// Peer message
	pub msg: String,
}




pub struct WsChatSession {
	/// unique session id
	pub id: usize,
	/// Client must send ping at least once per 10 seconds (CLIENT_TIMEOUT),
	/// otherwise we drop connection.
	pub hb: Instant,
	/// peer name
	pub name: Option<String>,
	/// Chat server
	pub addr: Addr<ChatServer>,
}

impl Actor for WsChatSession {
	type Context = ws::WebsocketContext<Self>;

	/// Method is called on actor start.
	/// We register ws session with ChatServer
	fn started(&mut self, ctx: &mut Self::Context) {
		// we'll start heartbeat process on session start.
		self.hb(ctx);

		// register self in chat server. `AsyncContext::wait` register
		// future within context, but context waits until this future resolves
		// before processing any other events.
		// HttpContext::state() is instance of WsChatSessionState, state is shared
		// across all routes within application
		let addr = ctx.address();
		self.addr
			.send(Connect {
				addr: addr.recipient(),
			})
			.into_actor(self)
			.then(|res, act, ctx| {
				match res {
					Ok(res) => act.id = res,
					// something is wrong with chat server
					_ => ctx.stop(),
				}
				fut::ready(())
			})
			.wait(ctx);
	}

	fn stopping(&mut self, _: &mut Self::Context) -> Running {
		// notify chat server
		println!("stopped");
		self.addr.do_send(Disconnect { id: self.id });
		Running::Stop
	}
}

/// Handle messages from chat server, we simply send it to peer websocket
impl Handler<Message> for WsChatSession {
	type Result = ();

	fn handle(&mut self, msg: Message, ctx: &mut Self::Context) {
		ctx.text(msg.0);
	}
}

/// WebSocket message handler
impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for WsChatSession {
	fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
		let msg = match msg {
			Err(_) => {
				ctx.stop();
				return;
			}
			Ok(msg) => msg,
		};

		println!("WEBSOCKET MESSAGE: {:?}", msg);
		match msg {
			ws::Message::Ping(msg) => {
				self.hb = Instant::now();
				ctx.pong(&msg);
			}
			ws::Message::Pong(_) => {
				self.hb = Instant::now();
			}
			ws::Message::Text(text) => {
				let m = text.trim();
				// we check for /sss type of messages
				if m.starts_with('/') {
					let v: Vec<&str> = m.splitn(2, ' ').collect();
					match v[0] {
						"/name" => {
							if v.len() == 2 {
								self.name = Some(v[1].to_owned());
							} else {
								ctx.text("!!! name is required");
							}
						}
						_ => ctx.text(format!("!!! unknown command: {:?}", m)),
					}
				} else {
					let msg = if let Some(ref name) = self.name {
						format!("{}: {}", name, m)
					} else {
						m.to_owned()
					};
					// send message to chat server
					self.addr.do_send(ClientMessage {
						id: self.id,
						msg,
					})
				}
			}
			ws::Message::Binary(_) => println!("Unexpected binary"),
			ws::Message::Close(reason) => {
				ctx.close(reason);
				ctx.stop();
			}
			ws::Message::Continuation(_) => {
				ctx.stop();
			}
			ws::Message::Nop => (),
		}
	}
}

impl WsChatSession {
	/// helper method that sends ping to client every second.
	///
	/// also this method checks heartbeats from client
	fn hb(&self, ctx: &mut ws::WebsocketContext<Self>) {
		ctx.run_interval(HEARTBEAT_INTERVAL, |act, ctx| {
			// check client heartbeats
			if Instant::now().duration_since(act.hb) > CLIENT_TIMEOUT {
				// heartbeat timed out
				println!("Websocket Client heartbeat failed, disconnecting!");

				// notify chat server
				act.addr.do_send(Disconnect { id: act.id });

				// stop actor
				ctx.stop();

				// don't try to send a ping
				return;
			}

			ctx.ping(b"");
		});
	}
}

/// `ChatServer` manages chat rooms and responsible for coordinating chat
/// session. implementation is super primitive
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

/// Make actor from `ChatServer`
impl Actor for ChatServer {
	/// We are going to use simple Context, we just need ability to communicate
	/// with other actors.
	type Context = Context<Self>;
}

/// Handler for Connect message.
///
/// Register new session and assign unique id to this session
impl Handler<Connect> for ChatServer {
	type Result = usize;

	fn handle(&mut self, msg: Connect, _: &mut Context<Self>) -> Self::Result {
		println!("Someone joined");

		// notify all users in same room
		self.send_message("Someone joined");

		// register session with random id
		let id = self.rng.gen::<usize>();
		self.sessions.insert(id, msg.addr);

		// send id back
		id
	}
}

/// Handler for Disconnect message.
impl Handler<Disconnect> for ChatServer {
	type Result = ();

	fn handle(&mut self, msg: Disconnect, _: &mut Context<Self>) {
		println!("Someone disconnected");
		// remove address
		self.sessions.remove(&msg.id);
	}
}

/// Handler for Message message.
impl Handler<ClientMessage> for ChatServer {
	type Result = ();

	fn handle(&mut self, msg: ClientMessage, _: &mut Context<Self>) {
		self.send_message(msg.msg.as_str());
	}
}


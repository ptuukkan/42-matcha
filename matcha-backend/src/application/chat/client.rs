use super::server::ChatServer;
use crate::application::profile;
use actix::prelude::*;
use actix_web_actors::ws;
use serde::{Deserialize, Serialize};
use std::time::{Duration, Instant};

const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);
const CLIENT_TIMEOUT: Duration = Duration::from_secs(10);

#[derive(Message)]
#[rtype(result = "()")]
pub struct Message(pub String);

#[derive(Message)]
#[rtype(usize)]
pub struct Connect {
	pub addr: Recipient<Message>,
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct Disconnect {
	pub id: usize,
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct ClientMessage {
	pub id: usize,

	pub msg: String,
}

pub struct WsChatSession {
	pub id: usize,
	pub hb: Instant,
	pub name: Option<String>,
	pub addr: Addr<ChatServer>,
	pub profile_key: Option<String>,
}

#[derive(Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum WsMessage {
	WsChatMessage(WsChatMessage),
	WsOnlineMessage(WsOnlineMessage),
}

#[derive(Serialize, Deserialize)]
pub struct WsChatMessage {
	pub message: String,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WsOnlineMessage {
	pub profile_key: String,
}

impl Actor for WsChatSession {
	type Context = ws::WebsocketContext<Self>;

	fn started(&mut self, ctx: &mut Self::Context) {
		self.hb(ctx);
		let addr = ctx.address();
		self.addr
			.send(Connect {
				addr: addr.recipient(),
			})
			.into_actor(self)
			.then(|res, act, ctx| {
				match res {
					Ok(res) => act.id = res,

					_ => ctx.stop(),
				}
				fut::ready(())
			})
			.wait(ctx);
	}

	fn stopping(&mut self, _ctx: &mut Self::Context) -> Running {
		self.addr.do_send(Disconnect { id: self.id });
		if let Some(key) = self.profile_key.to_owned() {
			actix_web::rt::spawn(async move {
				let _ = profile::utils::set_offline(&key).await;
			});
		}
		Running::Stop
	}
}

impl Handler<Message> for WsChatSession {
	type Result = ();

	fn handle(&mut self, msg: Message, ctx: &mut Self::Context) {
		ctx.text(msg.0);
	}
}

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
				self.handle_message(text.trim());
			}
			ws::Message::Close(reason) => {
				ctx.close(reason);
				ctx.stop();
			}
			ws::Message::Nop => (),
			_ => ctx.stop(),
		}
	}
}

impl WsChatSession {
	fn hb(&self, ctx: &mut ws::WebsocketContext<Self>) {
		ctx.run_interval(HEARTBEAT_INTERVAL, |act, ctx| {
			if Instant::now().duration_since(act.hb) > CLIENT_TIMEOUT {
				println!("Websocket Client heartbeat failed, disconnecting!");
				act.addr.do_send(Disconnect { id: act.id });
				ctx.stop();
				return;
			}
			ctx.ping(b"");
		});
	}

	fn handle_message(&mut self, message: &str) {
		if let Ok(ws_message) = serde_json::from_str::<WsMessage>(message) {
			match ws_message {
				WsMessage::WsOnlineMessage(m) => {
					self.profile_key = Some(m.profile_key.to_owned());
					actix_web::rt::spawn(async move {
						let _ = profile::utils::set_online(&m.profile_key).await;
					});

					// let future = async move {
					// 	set_online(&text).await;
					// };
					// future.into_actor(self).spawn(ctx);
				}
				WsMessage::WsChatMessage(m) => self.addr.do_send(ClientMessage {
					id: self.id,
					msg: m.message,
				}),
			}
		}
	}
}

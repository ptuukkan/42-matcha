use super::server::WsServer;
use actix::prelude::*;
use actix_web_actors::ws;
use serde::{Deserialize, Serialize};
use std::time::{Duration, Instant};

const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);
const CLIENT_TIMEOUT: Duration = Duration::from_secs(10);

pub struct WsSession {
	pub hb: Instant,
	pub addr: Addr<WsServer>,
	pub profile_key: Option<String>,
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct JoinMessage {
	pub profile_key: String,
	pub addr: Addr<WsSession>,
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct LeaveMessage {
	pub profile_key: String,
}

#[derive(Serialize, Deserialize, Message)]
#[rtype(result = "()")]
#[serde(untagged)]
pub enum WsMessage {
	WsChatMessage(WsChatMessage),
	WsOnlineMessage(WsOnlineMessage),
}

#[derive(Serialize, Deserialize, Message, Clone)]
#[rtype(result = "()")]
#[serde(rename_all = "camelCase")]
pub struct WsChatMessage {
	pub chat_id: String,
	pub message: String,
	pub to: String,
	pub from: String,
	pub timestamp: i64,
}

#[derive(Serialize, Deserialize, Message)]
#[rtype(result = "()")]
#[serde(rename_all = "camelCase")]
pub struct WsOnlineMessage {
	pub profile_id: String,
}

impl Actor for WsSession {
	type Context = ws::WebsocketContext<Self>;

	fn started(&mut self, ctx: &mut Self::Context) {
		self.hb(ctx);
		// let addr = ctx.address();
		// self.addr
		// 	.send(Connect {
		// 		addr: addr.recipient(),
		// 	})
		// 	.into_actor(self)
		// 	.then(|res, act, ctx| {
		// 		match res {
		// 			Ok(res) => act.id = res,

		// 			_ => ctx.stop(),
		// 		}
		// 		fut::ready(())
		// 	})
		// 	.wait(ctx);
	}

	fn stopping(&mut self, _ctx: &mut Self::Context) -> Running {
		if let Some(key) = self.profile_key.to_owned() {
			self.addr.do_send(LeaveMessage {
				profile_key: key,
			});
		}
		Running::Stop
	}
}

impl Handler<WsChatMessage> for WsSession {
	type Result = ();

	fn handle(&mut self, msg: WsChatMessage, ctx: &mut Self::Context) {
		if let Ok(serialized_msg) = serde_json::to_string(&msg) {
			ctx.text(serialized_msg);
		}
	}
}

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for WsSession {
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
				if let Ok(ws_message) = serde_json::from_str::<WsMessage>(text.trim()) {
					match ws_message {
						WsMessage::WsOnlineMessage(m) => {
							self.profile_key = Some(m.profile_id.to_owned());
							self.addr.do_send(JoinMessage {
								profile_key: m.profile_id,
								addr: ctx.address(),
							});
						},
						WsMessage::WsChatMessage(m) =>  self.addr.do_send(m)
					}
				}
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

impl WsSession {
	fn hb(&self, ctx: &mut ws::WebsocketContext<Self>) {
		ctx.run_interval(HEARTBEAT_INTERVAL, |act, ctx| {
			if Instant::now().duration_since(act.hb) > CLIENT_TIMEOUT {
				// println!("Websocket Client heartbeat failed, disconnecting!");
				// act.addr.do_send(Disconnect { id: act.id });
				ctx.stop();
				return;
			}
			ctx.ping(b"");
		});
	}
}

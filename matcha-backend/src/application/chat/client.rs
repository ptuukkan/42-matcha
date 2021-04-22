use super::server::WsServer;
use crate::models::notification::NotificationDto;
use actix::prelude::*;
use actix_web_actors::ws;
use serde::{Deserialize, Serialize};
use std::time::{Duration, Instant};

const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);
const CLIENT_TIMEOUT: Duration = Duration::from_secs(10);

pub struct WsSession {
	pub hb: Instant,
	pub ws_srv: Addr<WsServer>,
	pub profile_key: Option<String>,
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct JoinMessage {
	pub profile_key: String,
	pub ws_client: Addr<WsSession>,
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct LeaveMessage {
	pub profile_key: String,
}

#[derive(Serialize, Deserialize)]
#[serde(untagged)]
pub enum WsMessage {
	WsChatMessage(WsChatMessage),
	WsOnlineMessage(WsOnlineMessage),
	WsNotificationMessage(NotificationDto),
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

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WsMessageWrapper {
	pub message_type: String,
	pub message: WsMessage,
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
			self.ws_srv.do_send(LeaveMessage { profile_key: key });
		}
		Running::Stop
	}
}

impl Handler<WsChatMessage> for WsSession {
	type Result = ();

	fn handle(&mut self, msg: WsChatMessage, ctx: &mut Self::Context) {
		let msg_wrapper = WsMessageWrapper {
			message_type: "ChatMessage".to_owned(),
			message: WsMessage::WsChatMessage(msg),
		};
		if let Ok(serialized_msg) = serde_json::to_string(&msg_wrapper) {
			ctx.text(serialized_msg);
		}
	}
}

impl Handler<NotificationDto> for WsSession {
	type Result = ();

	fn handle(&mut self, msg: NotificationDto, ctx: &mut Self::Context) {
		let msg_wrapper = WsMessageWrapper {
			message_type: "NotificationMessage".to_owned(),
			message: WsMessage::WsNotificationMessage(msg),
		};
		if let Ok(serialized_msg) = serde_json::to_string(&msg_wrapper) {
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
							self.ws_srv.do_send(JoinMessage {
								profile_key: m.profile_id,
								ws_client: ctx.address(),
							});
						}
						WsMessage::WsChatMessage(m) => self.ws_srv.do_send(m),
						_ => (),
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

use crate::models::profile::Profile;
use std::time::{Duration, Instant};
use actix::prelude::*;
use actix_web_actors::ws;

/// How often heartbeat pings are sent
const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);
/// How long before lack of client response causes a timeout
const CLIENT_TIMEOUT: Duration = Duration::from_secs(10);

/// websocket connection is long running connection, it easier
/// to handle with an actor
pub struct MyWebSocket {
	/// Client must send ping at least once per 10 seconds (CLIENT_TIMEOUT),
	/// otherwise we drop connection.
	hb: Instant,
	profile_key: Option<String>,
}

impl MyWebSocket {
	pub fn new() -> Self {
		Self {
			hb: Instant::now(),
			profile_key: None,
		}
	}

	fn hb(&self, ctx: &mut <Self as Actor>::Context) {
		ctx.run_interval(HEARTBEAT_INTERVAL, |act, ctx| {
			// check client heartbeats
			if Instant::now().duration_since(act.hb) > CLIENT_TIMEOUT {
				// heartbeat timed out
				println!("Websocket Client heartbeat failed, disconnecting!");

				// stop actor
				ctx.stop();

				// don't try to send a ping
				return;
			}
			ctx.ping(b"");
		});
	}
}

impl Actor for MyWebSocket {
	type Context = ws::WebsocketContext<Self>;

	/// Method is called on actor start. We start the heartbeat process here.
	fn started(&mut self, ctx: &mut Self::Context) {
		self.hb(ctx);
	}
}

/// Handler for `ws::Message`
impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for MyWebSocket {
	fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
		// process websocket messages
		println!("WS: {:?}, user: {:?}", msg, self.profile_key);
		match msg {
			Ok(ws::Message::Ping(msg)) => {
				self.hb = Instant::now();
				ctx.pong(&msg);
			}
			Ok(ws::Message::Pong(_)) => {
				self.hb = Instant::now();
			}
			Ok(ws::Message::Text(text)) => {
				let future = async move {
					set_online(&text).await;
				};

				future.into_actor(self).spawn(ctx);
			}
			Ok(ws::Message::Binary(bin)) => ctx.binary(bin),
			Ok(ws::Message::Close(reason)) => {
				ctx.close(reason);
				ctx.stop();
			}
			_ => ctx.stop(),
		}
	}
}

async fn set_online(profile_key: &str) {
	let p = Profile::get(profile_key).await;
	if p.is_err() {
		return;
	}
	let mut profile = p.unwrap();
	profile.last_seen = Some("online".to_owned());
	let res = profile.update().await;
	if res.is_err() {
		return;
	}
}

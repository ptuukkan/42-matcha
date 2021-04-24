use crate::chat::client::WsChatMessage;
use crate::database::api;
use crate::database::cursor::CursorRequest;
use crate::errors::AppError;
use crate::models::base::CreateResponse;
use crate::models::profile::ProfileSlice;
use crate::models::profile::ProfileThumbnail;
use serde::{Deserialize, Serialize};
use std::convert::TryFrom;
use std::env;

#[derive(Serialize, Deserialize, Debug)]
pub struct Chat {
	#[serde(skip_serializing)]
	#[serde(rename = "_key")]
	pub key: String,
	pub messages: Vec<Message>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChatDto {
	pub participant: ProfileThumbnail,
	pub messages: Vec<Message>,
	pub chat_id: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Message {
	pub timestamp: i64,
	pub from: String,
	pub message: String,
}

impl Chat {
	pub fn new() -> Self {
		Self {
			key: String::new(),
			messages: Vec::new(),
		}
	}

	fn url() -> Result<String, AppError> {
		let db_url: String = env::var("DB_URL")?;
		Ok(db_url + "_api/document/chats/")
	}

	fn key_url(&self) -> Result<String, AppError> {
		Ok(format!("{}{}", &Self::url()?, self.key))
	}

	fn vertex_key_url(&self) -> Result<String, AppError> {
		let db_url: String = env::var("DB_URL")?;
		Ok(format!(
			"{}_api/gharial/relations/vertex/chats/{}",
			db_url, self.key
		))
	}

	pub async fn get(key: &str) -> Result<Self, AppError> {
		let url = format!("{}{}", Self::url()?, key);
		let location = api::get::<Self>(&url).await?;
		Ok(location)
	}

	pub async fn update(&self) -> Result<(), AppError> {
		api::patch(&self.key_url()?, &self).await?;
		Ok(())
	}

	pub async fn create(&mut self) -> Result<(), AppError> {
		let res = api::post::<Self, CreateResponse>(&Self::url()?, &self).await?;
		self.key = res.key;
		Ok(())
	}

	pub async fn delete(&self) -> Result<(), AppError> {
		api::delete(&self.vertex_key_url()?).await?;
		Ok(())
	}

	// Gets users all chats
	pub async fn find_outbound(profile_key: &str) -> Result<Vec<Self>, AppError> {
		let query = format!(
			"FOR v in 1..1 OUTBOUND 'profiles/{}' chatConnections RETURN v",
			profile_key
		);
		let vertices = CursorRequest::from(query)
			.send()
			.await?
			.extract_all::<Self>()
			.await?;
		Ok(vertices)
	}

	pub async fn get_participants(chat_key: &str) -> Result<Vec<ProfileThumbnail>, AppError> {
		let query = format!(
			"for v in 1..1 inbound 'chats/{}' chatConnections RETURN MERGE(v, {{ images: DOCUMENT('images', v.images)}})",
			chat_key
		);
		let vertices = CursorRequest::from(query)
			.send()
			.await?
			.extract_all::<ProfileSlice>()
			.await?;
		let vertices: Vec<ProfileThumbnail> = vertices
			.iter()
			.filter_map(|x| ProfileThumbnail::try_from(x).ok())
			.collect();
		Ok(vertices)
	}
}

impl From<WsChatMessage> for Message {
	fn from(ws_message: WsChatMessage) -> Self {
		Self {
			timestamp: ws_message.timestamp,
			from: ws_message.from,
			message: ws_message.message,
		}
	}
}

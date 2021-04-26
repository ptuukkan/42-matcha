use crate::database::cursor::CursorRequest;
use crate::database::api;
use crate::errors::AppError;
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Serialize, Deserialize)]
pub struct ChatConnection {
	#[serde(skip_serializing)]
	#[serde(rename = "_key")]
	key: String,
	#[serde(rename = "_from")]
	from: String,
	#[serde(rename = "_to")]
	to: String,
	pub unread: bool,
}

impl ChatConnection {
	fn url() -> Result<String, AppError> {
		let db_url: String = env::var("DB_URL")?;
		Ok(db_url + "_api/gharial/relations/edge/chatConnections/")
	}

	fn key_url(&self) -> Result<String, AppError> {
		Ok(format!("{}{}", &Self::url()?, self.key))
	}

	pub fn new(from: &str, to: &str) -> Self {
		Self {
			key: String::new(),
			from: format!("profiles/{}", from),
			to: format!("chats/{}", to),
			unread: false,
		}
	}

	pub async fn create(&self) -> Result<(), AppError> {
		let url = Self::url()?;

		let res: api::ArangoEdgeResponse = api::post(&url, &self).await?;
		if res.error {
			Err(AppError::internal("Edge creation failed"))
		} else {
			Ok(())
		}
	}

	pub async fn update(&self) -> Result<(), AppError> {
		api::patch(&self.key_url()?, &self).await?;
		Ok(())
	}

	pub async fn find(from: &str, to: &str) -> Result<Option<Self>, AppError> {
		let query = format!(
			"FOR v, e IN 1..1 OUTBOUND 'profiles/{}' chatConnections FILTER e._to == 'chats/{}' RETURN e",
			from, to
		);
		let mut edges = CursorRequest::from(query)
			.send()
			.await?
			.extract_all::<Self>()
			.await?;
		if let Some(vertex) = edges.pop() {
			Ok(Some(vertex))
		} else {
			Ok(None)
		}
	}
}

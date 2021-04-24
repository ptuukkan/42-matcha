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
}

impl ChatConnection {
	fn url() -> Result<String, AppError> {
		let db_url: String = env::var("DB_URL")?;
		Ok(db_url + "_api/gharial/relations/edge/chatConnections/")
	}

	pub fn new(from: &str, to: &str) -> Self {
		Self {
			key: String::new(),
			from: format!("profiles/{}", from),
			to: format!("chats/{}", to),
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
}

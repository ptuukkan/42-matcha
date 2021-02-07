use core::fmt::Debug;
use actix_web::web::Bytes;
use serde::{Deserialize, Serialize, de};
use std::convert::From;
use super::api;
use std::env;
use actix_web::client::Client;
use serde_json;
use crate::errors::{AppError};


#[derive(Serialize, Debug)]
pub struct CursorRequest {
	query: String,
	count: bool,
	#[serde(rename = "batchSize")]
	batch_size: i32
}

#[derive(Deserialize, Debug)]
pub struct CursorResponse {
	pub code: i32,
	pub error: bool,
	#[serde(rename = "errorMessage")]
	pub error_message: Option<String>,
	#[serde(rename = "errorNum")]
	pub error_num: Option<i32>,
	#[serde(skip)]
	bytes: Bytes
}

#[derive(Deserialize, Debug)]
pub struct Cursor<T> {
	#[serde(rename = "hasMore")]
	pub has_more: bool,
	pub id: Option<String>,
	pub count: i32,
	pub error: bool,
	pub code: i32,
	pub result: Vec<T>
}

impl CursorRequest {
	fn url() -> String {
		let db_url: String = env::var("DB_URL")
			.expect("Missing env variable DB_URL");
		db_url + "_api/cursor"
	}

	pub async fn send(&self) -> Result<CursorResponse, AppError> {

		let jwt = api::get_arango_jwt().await.expect("DB Login failed");
		let client = Client::default();
		let bytes = client.post(&Self::url())
			.set_header("Authorization", "bearer ".to_owned() + &jwt)
			.send_json(&self)
			.await?
			.body()
			.await?;
		let mut cursor_response: CursorResponse = serde_json::from_slice(&bytes)?;
		if cursor_response.error == true {
			return Err(AppError::internal(cursor_response));
		}
		cursor_response.bytes = bytes;
		Ok(cursor_response)
	}
}

impl CursorResponse {
	pub async fn extract_all<T: de::DeserializeOwned + Debug>(&self) -> Result<Vec<T>, AppError> {
		let mut cursor: Cursor<T> = serde_json::from_slice(&self.bytes)?;
		if cursor.result.is_empty() || !cursor.has_more {
			return Ok(cursor.result);
		}
		let mut return_data: Vec<T> = cursor.result.drain(0..).collect();
		let id = cursor.id.unwrap();
		let mut has_more = cursor.has_more;
		while has_more {
			let jwt = api::get_arango_jwt().await.expect("DB Login failed");
			let url = CursorRequest::url() + "/" + &id;
			let client = Client::default();
			let bytes = client.put(url)
				.set_header("Authorization", "bearer ".to_owned() + &jwt)
				.send()
				.await?
				.body()
				.await?;
			let cursor_response: CursorResponse = serde_json::from_slice(&bytes)?;
			if cursor_response.error == true {
				return Err(AppError::internal(cursor_response));
			}
			let mut cursor: Cursor<T> = serde_json::from_slice(&bytes)?;
			return_data.append(&mut cursor.result);
			has_more = cursor.has_more;
		}
		Ok(return_data)
	}
}

impl From<&str> for CursorRequest {
	fn from(cursor_query: &str) -> Self {
		CursorRequest {
			query: cursor_query.to_owned(),
			count: true,
			batch_size: 2
		}
	}
}

impl From<String> for CursorRequest {
	fn from(cursor_query: String) -> Self {
		CursorRequest {
			query: cursor_query.to_owned(),
			count: true,
			batch_size: 2
		}
	}
}




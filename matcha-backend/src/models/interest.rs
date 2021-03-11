use crate::database::cursor::CursorRequest;
use crate::database::api;
use crate::errors::AppError;
use crate::models::base::CreateResponse;
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Interest {
	#[serde(skip_serializing)]
	#[serde(rename = "_key")]
	pub key: String,
	pub name: String,
}

impl Interest {
	fn url() -> Result<String, AppError> {
		let db_url: String = env::var("DB_URL")?;
		Ok(db_url + "_api/document/interests/")
	}

	fn key_url(&self) -> Result<String, AppError> {
		Ok(format!("{}{}", &Self::url()?, self.key))
	}

	pub async fn create(&mut self) -> Result<(), AppError> {
		let res = api::post::<Self, CreateResponse>(&Self::url()?, &self).await?;
		self.key = res.key;
		Ok(())
	}

	pub async fn get(key: &str) -> Result<Self, AppError> {
		let url = format!("{}{}", Self::url()?, key);
		let user = api::get::<Self>(&url).await?;
		Ok(user)
	}

	pub async fn find(key: &str, value: &str) -> Result<Vec<Self>, AppError> {
		let query = format!("FOR i IN interests filter i.{} == '{}' return i", key, value);
		let result = CursorRequest::from(query)
			.send()
			.await?
			.extract_all::<Self>()
			.await?;
		Ok(result)
	}

	pub async fn get_all() -> Result<Vec<Self>, AppError> {
		let query = format!("FOR i IN interests return i");
		let result = CursorRequest::from(query)
			.send()
			.await?
			.extract_all::<Self>()
			.await?;
		Ok(result)
	}
}

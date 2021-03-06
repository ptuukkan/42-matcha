use crate::database::api;
use crate::errors::AppError;
use crate::models::base::{CreateResponse};
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Serialize, Deserialize, Debug)]
pub struct Image {
	#[serde(skip_serializing)]
	#[serde(rename = "_key")]
	pub key: String,
	pub is_main: bool,
}

impl Image {
	pub fn new() -> Self {
		Self {
			key: String::new(),
			is_main: false,
		}
	}
	fn url() -> Result<String, AppError> {
		let db_url: String = env::var("DB_URL")?;
		Ok(db_url + "_api/document/images/")
	}

	fn key_url(&self) -> Result<String, AppError> {
		Ok(format!("{}{}", &Self::url()?, self.key))
	}

	pub async fn create(&mut self) -> Result<(), AppError> {
		let res = api::post::<Self, CreateResponse>(&Self::url()?, &self).await?;
		self.key = res.key;
		Ok(())
	}

	pub async fn update(&self) -> Result<(), AppError> {
		api::patch(&self.key_url()?, &self).await?;
		Ok(())
	}

	pub async fn get(key: &str) -> Result<Self, AppError> {
		let url = format!("{}{}", Self::url()?, key);
		let user = api::get::<Self>(&url).await?;
		Ok(user)
	}

	pub async fn delete(&self) -> Result<(), AppError> {
		api::delete(&self.key_url()?).await?;
		Ok(())
	}
}

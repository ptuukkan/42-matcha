use crate::database::api;
use crate::errors::AppError;
use crate::models::base::CreateResponse;
use actix_web_validator::Validate;
use serde::Deserializer;
use serde::{de, Deserialize, Serialize};
use serde_json::Value;
use std::env;

#[derive(Serialize, Deserialize, Debug, Validate)]
pub struct Location {
	#[serde(skip_serializing)]
	#[serde(rename = "_key")]
	pub key: String,
	pub coordinate: Vec<f32>,
}

impl Location {
	pub fn new() -> Self {
		Self {
			key: String::new(),
			coordinate: vec![0.0, 0.0],
		}
	}

	fn url() -> Result<String, AppError> {
		let db_url: String = env::var("DB_URL")?;
		Ok(db_url + "_api/document/locations/")
	}
	fn key_url(&self) -> Result<String, AppError> {
		Ok(format!("{}{}", &Self::url()?, self.key))
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
		let res = api::post::<Location, CreateResponse>(&Self::url()?, &self).await?;
		self.key = res.key;
		Ok(())
	}
}

#[derive(Serialize, Deserialize, Debug, Validate)]
pub struct LocationDto {
	#[serde(deserialize_with = "de_coordinate")]
	pub latitude: f32,
	#[serde(deserialize_with = "de_coordinate")]
	pub longitude: f32,
}

fn de_coordinate<'de, D: Deserializer<'de>>(deserializer: D) -> Result<f32, D::Error> {
	Ok(match Value::deserialize(deserializer)? {
		Value::String(s) => s.trim().parse().map_err(de::Error::custom)?,
		Value::Number(num) => num
			.as_f64()
			.ok_or_else(|| de::Error::custom("Invalid number"))? as f32,
		_ => return Err(de::Error::custom("wrong type")),
	})
}

impl From<Location> for LocationDto {
	fn from(location: Location) -> Self {
		Self {
			latitude: location.coordinate[0],
			longitude: location.coordinate[1],
		}
	}
}

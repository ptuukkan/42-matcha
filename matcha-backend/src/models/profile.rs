use crate::models::user::RegisterFormValues;
use crate::database::api;
use crate::database::cursor::CursorRequest;
use crate::errors::AppError;
use crate::models::base::CreateResponse;
use crate::models::image::Image;
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Profile {
	#[serde(skip_serializing)]
	#[serde(rename = "_key")]
	pub key: String,
	first_name: String,
	last_name: String,
	gender: Option<Gender>,
	sexual_preference: SexualPreference,
	biography: Option<String>,
	interests: Vec<String>,
	pub images: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
enum Gender {
	Male,
	Female,
}

#[derive(Debug, Serialize, Deserialize)]
enum SexualPreference {
	Male,
	Female,
	Both,
}

#[derive(Deserialize, Debug)]
struct CreateProfileResponse {
	#[serde(rename = "_key")]
	key: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ProfileFormValues {
	first_name: Option<String>,
	last_name: Option<String>,
	gender: Option<Gender>,
	sexual_preference: Option<SexualPreference>,
	biography: Option<String>,
	interests: Option<Vec<String>>,
}

impl Profile {
	fn url() -> Result<String, AppError> {
		let db_url: String = env::var("DB_URL")?;
		Ok(db_url + "_api/document/profiles/")
	}

	fn key_url(&self) -> Result<String, AppError> {
		Ok(format!("{}{}", &Self::url()?, self.key))
	}

	pub async fn create(&mut self) -> Result<(), AppError> {
		let res = api::post::<Profile, CreateResponse>(&Profile::url()?, &self).await?;
		self.key = res.key;
		Ok(())
	}

	pub async fn update(&self) -> Result<(), AppError> {
		api::patch(&self.key_url()?, &self).await?;
		Ok(())
	}

	pub async fn update_from_form(&self, values: &ProfileFormValues) -> Result<(), AppError> {
		api::patch(&self.key_url()?, values).await?;
		Ok(())
	}

	pub async fn get(key: &str) -> Result<Self, AppError> {
		let url = format!("{}{}", Self::url()?, key);
		let profile = api::get::<Self>(&url).await?;
		Ok(profile)
	}

	pub async fn delete(&self) -> Result<(), AppError> {
		api::delete(&self.key_url()?).await?;
		Ok(())
	}

	pub async fn get_images(&self) -> Result<Vec<Image>, AppError> {
		let query = format!(
			"FOR p IN users filter p._key == '{}' return DOCUMENT(\"images\", p.images)",
			&self.key
		);
		let result = CursorRequest::from(query)
			.send()
			.await?
			.extract_all::<Image>()
			.await?;
		Ok(result)
	}
}

impl From<&RegisterFormValues> for Profile {
	fn from(values: &RegisterFormValues) -> Self {
		Self {
			key: "".to_owned(),
			first_name: values.first_name.to_owned(),
			last_name: values.last_name.to_owned(),
			gender: None,
			sexual_preference: SexualPreference::Both,
			biography: None,
			interests: vec![],
			images: vec![],
		}
	}
}

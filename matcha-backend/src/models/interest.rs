use crate::database::api;
use crate::database::cursor::CursorRequest;
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
		let res: CreateResponse = api::post(&Self::url()?, &self).await?;
		self.key = res.key;
		Ok(())
	}

	pub async fn create_many(interests: Vec<Interest>) -> Result<Vec<String>, AppError> {
		let url = Self::url()?;
		let res: Vec<CreateResponse> = api::post(&url, &interests).await?;
		let keys = res.into_iter().map(|x| x.key).collect();
		Ok(keys)
	}

	pub async fn get(key: &str) -> Result<Self, AppError> {
		let url = format!("{}{}", Self::url()?, key);
		let user = api::get(&url).await?;
		Ok(user)
	}

	pub async fn find(key: &str, value: &str) -> Result<Vec<Self>, AppError> {
		let query = format!(
			"FOR i IN interests filter i.{} == '{}' return i",
			key, value
		);
		let result = CursorRequest::from(query)
			.send()
			.await?
			.extract_all::<Self>()
			.await?;
		Ok(result)
	}

	pub async fn get_all() -> Result<Vec<Self>, AppError> {
		let query = "FOR i IN interests return i";
		let result = CursorRequest::from(query)
			.send()
			.await?
			.extract_all::<Self>()
			.await?;
		Ok(result)
	}

	pub async fn get_many(values: Vec<String>) -> Result<Vec<Option<Self>>, AppError> {
		let url = format!("{}{}", Self::url()?, "?onlyget=true");
		let res = api::put::<Vec<String>, Self>(&url, &values).await?;
		Ok(res)
	}
}

impl From<&String> for Interest {
	fn from(name: &String) -> Self {
		Self {
			key: String::new(),
			name: name.to_owned(),
		}
	}
}

#[derive(Serialize, Deserialize, Debug)]
pub struct InterestDto {
	pub value: String,
	pub text: String,
}

impl From<Interest> for InterestDto {
	fn from(interest: Interest) -> Self {
		Self {
			value: interest.key,
			text: interest.name,
		}
	}
}

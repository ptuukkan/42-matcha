use crate::database::api;
use crate::database::cursor::CursorRequest;
use crate::errors::AppError;
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Serialize, Deserialize)]
pub struct Visit {
	#[serde(skip_serializing)]
	#[serde(rename = "_key")]
	key: String,
	#[serde(rename = "_from")]
	from: String,
	#[serde(rename = "_to")]
	to: String,
	pub count: u32,
}

impl Visit {
	fn url() -> Result<String, AppError> {
		let db_url: String = env::var("DB_URL")?;
		Ok(db_url + "_api/gharial/relations/edge/visits/")
	}

	fn key_url(&self) -> Result<String, AppError> {
		Ok(format!("{}{}", &Self::url()?, self.key))
	}

	pub fn new(from: &str, to: &str) -> Self {
		Self {
			key: String::new(),
			from: format!("profiles/{}", from),
			to: format!("profiles/{}", to),
			count: 1,
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
			"FOR v, e IN 1..1 OUTBOUND 'profiles/{}' visits FILTER e._to == 'profiles/{}' RETURN e",
			from, to
		);
		let mut edges = CursorRequest::from(query)
			.send()
			.await?
			.extract_all::<Self>()
			.await?;
		if let Some(visit) = edges.pop() {
			Ok(Some(visit))
		} else {
			Ok(None)
		}
	}
}

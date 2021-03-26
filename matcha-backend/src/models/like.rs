use crate::database::api;
use crate::database::cursor::CursorRequest;
use crate::errors::AppError;
use crate::models::profile::ProfileSlice;
use crate::models::profile::ProfileThumbnail;
use serde::{Deserialize, Serialize};
use std::convert::TryFrom;
use std::env;

#[derive(Debug, Serialize, Deserialize)]
pub struct Like {
	#[serde(skip_serializing)]
	#[serde(rename = "_key")]
	key: String,
	#[serde(rename = "_from")]
	from: String,
	#[serde(rename = "_to")]
	to: String,
}

impl Like {
	fn url() -> Result<String, AppError> {
		let db_url: String = env::var("DB_URL")?;
		Ok(db_url + "_api/gharial/relations/edge/likes/")
	}

	fn key_url(&self) -> Result<String, AppError> {
		Ok(format!("{}{}", &Self::url()?, self.key))
	}

	fn collection_url() -> Result<String, AppError> {
		let db_url: String = env::var("DB_URL")?;
		Ok(db_url + "_api/collection/likes/")
	}

	pub fn new(from: &str, to: &str) -> Self {
		Self {
			key: String::new(),
			from: format!("profiles/{}", from),
			to: format!("profiles/{}", to),
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

	pub async fn delete(&self) -> Result<(), AppError> {
		api::delete(&self.key_url()?).await?;
		Ok(())
	}

	pub async fn find(from: &str, to: &str) -> Result<Option<Self>, AppError> {
		let query = format!(
			"FOR v, e IN 1..1 OUTBOUND 'profiles/{}' likes FILTER e._to == 'profiles/{}' RETURN e",
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

	pub async fn find_inbound(profile_key: &str) -> Result<Vec<ProfileThumbnail>, AppError> {
		let query = format!(
			"FOR v in 1..1 INBOUND 'profiles/{}' likes RETURN MERGE(v, {{ images: DOCUMENT('images', v.images) }} )",
			profile_key
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

	pub async fn count() -> Result<usize, AppError> {
		let url = format!("{}count", Self::collection_url()?);
		let res: api::ArangoCollectionCount = api::get(&url).await?;
		Ok(res.count)
	}
}

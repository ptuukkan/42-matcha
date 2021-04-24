use crate::database::api;
use crate::database::cursor::CursorRequest;
use crate::errors::AppError;
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Serialize, Deserialize)]
pub struct Report {
	#[serde(skip_serializing)]
	#[serde(rename = "_key")]
	key: String,
	#[serde(rename = "_from")]
	from: String,
	#[serde(rename = "_to")]
	to: String,
	reason: String,
}

impl Report {
	fn url() -> Result<String, AppError> {
		let db_url: String = env::var("DB_URL")?;
		Ok(db_url + "_api/gharial/relations/edge/reports/")
	}

	pub fn new(from: &str, to: &str, reason: ReportFormValues) -> Self {
		Self {
			key: String::new(),
			from: format!("profiles/{}", from),
			to: format!("profiles/{}", to),
			reason: reason.reason,
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

	pub async fn find(from: &str, to: &str) -> Result<Option<Self>, AppError> {
		let query = format!(
			"FOR v, e IN 1..1 OUTBOUND 'profiles/{}' reports FILTER e._to == 'profiles/{}' RETURN e",
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

#[derive(Debug, Deserialize)]
pub struct ReportFormValues {
	reason: String,
}

impl ReportFormValues {
	pub fn validate(&self) -> Result<(), AppError> {
		if self.reason.len() > 255 {
			return Err(AppError::bad_request("invalid data"));
		}
		Ok(())
	}
}

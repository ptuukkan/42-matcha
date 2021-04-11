use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct CreateResponse {
	#[serde(rename = "_key")]
	pub key: String
}

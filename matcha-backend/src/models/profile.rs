use crate::errors::AppError;
use serde::{Deserialize, Serialize};
use crate::database::api;
use std::env;

#[derive(Debug, Serialize, Deserialize)]
pub struct Profile {
	#[serde(skip_serializing)]
	#[serde(rename = "_key")]
	pub key: String,
	first_name: String,
	last_name: String,
	gender: Gender,
	sexual_preference: SexualPreference,
	biography: String,
	interests: Vec<String>,
	pictures: Vec<String>,
	profile_picture: String,
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

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ProfileFormValues {
	first_name: String,
	last_name: String,
	gender: Gender,
	sexual_preference: SexualPreference,
	biography: String,
	interests: Vec<String>,
	pictures: Vec<String>,
	profile_picture: String,
}


impl Profile {
	fn url() -> String {
		let db_url: String = env::var("DB_URL").expect("Missing env variable DB_URL");
		db_url + "_api/document/profiles/"
	}

	pub async fn create(&self) -> Result<String, AppError> {
		let res = api::post::<Profile, CreateProfileResponse>(&Profile::url(), &self).await?;
		Ok(res.key)
	}
}

impl From<ProfileFormValues> for Profile {
	fn from(values: ProfileFormValues) -> Self {
		Self {
			key: "".to_owned(),
			first_name: values.first_name,
			last_name: values.last_name,
			gender: values.gender,
			sexual_preference: values.sexual_preference,
			biography: values.biography,
			interests: values.interests,
			pictures: values.pictures,
			profile_picture: values.profile_picture
		}
	}
}

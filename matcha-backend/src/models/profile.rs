use crate::database::api;
use crate::database::cursor::CursorRequest;
use crate::errors::AppError;
use crate::models::base::CreateResponse;
use crate::models::image::{Image, ImageDto};
use crate::models::user::RegisterFormValues;
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::convert::TryFrom;
use std::env;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Profile {
	#[serde(skip_serializing)]
	#[serde(rename = "_key")]
	pub key: String,
	pub first_name: String,
	pub last_name: String,
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

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ProfileFormValues {
	first_name: Option<String>,
	last_name: Option<String>,
	gender: Option<Gender>,
	sexual_preference: Option<SexualPreference>,
	biography: Option<String>,
	pub interests: Option<Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProfileSlice {
	#[serde(skip_serializing)]
	#[serde(rename = "_key")]
	pub key: String,
	first_name: String,
	pub images: Vec<Image>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProfileThumbnail {
	id: String,
	first_name: String,
	image: ImageDto,
}

impl Profile {
	fn url() -> Result<String, AppError> {
		let db_url: String = env::var("DB_URL")?;
		Ok(db_url + "_api/document/profiles/")
	}

	fn key_url(&self) -> Result<String, AppError> {
		Ok(format!("{}{}", &Self::url()?, self.key))
	}

	fn graph_url() -> Result<String, AppError> {
		Ok(format!(
			"{}{}",
			env::var("DB_URL")?,
			"_api/gharial/relations/"
		))
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
			"FOR p IN profiles filter p._key == '{}' return DOCUMENT(\"images\", p.images)",
			&self.key
		);
		let mut result = CursorRequest::from(query)
			.send()
			.await?
			.extract_all::<Vec<Image>>()
			.await?;
		if let Some(images) = result.pop() {
			Ok(images)
		} else {
			Err(AppError::internal("No images found"))
		}
	}

	pub fn is_complete(&self) -> bool {
		self.gender.is_some()
			&& self.biography.is_some()
			&& !self.images.is_empty()
			&& !self.interests.is_empty()
	}

	pub async fn like(&self, profile_key: &str) -> Result<(), AppError> {
		let url = format!("{}{}", Profile::graph_url()?, "edge/likes");
		let body = json!({
			"_from": format!("profiles/{}", profile_key),
			"_to": format!("profiles/{}", &self.key)
		});

		let res: api::ArangoEdgeResponse = api::post(&url, &body).await?;
		if res.error {
			Err(AppError::internal("Edge creation failed"))
		} else {
			Ok(())
		}
	}

	pub async fn get_visits(&self) -> Result<Vec<ProfileThumbnail>, AppError> {
		let query = format!(
			"FOR v in 1..1 INBOUND 'profiles/{}' visits RETURN MERGE(v, {{ images: DOCUMENT('images', v.images) }} )",
			&self.key
		);
		let visits = CursorRequest::from(query)
			.send()
			.await?
			.extract_all::<ProfileSlice>()
			.await?;
		let visits: Vec<ProfileThumbnail> = visits
			.iter()
			.filter_map(|x| ProfileThumbnail::try_from(x).ok())
			.collect();
		Ok(visits)
	}


	pub async fn get_likes(&self) -> Result<Vec<ProfileThumbnail>, AppError> {
		let query = format!(
			"FOR v in 1..1 INBOUND 'profiles/{}' likes RETURN MERGE(v, {{ images: DOCUMENT('images', v.images) }} )",
			&self.key
		);
		let likes = CursorRequest::from(query)
			.send()
			.await?
			.extract_all::<ProfileSlice>()
			.await?;
		let likes: Vec<ProfileThumbnail> = likes
			.iter()
			.filter_map(|x| ProfileThumbnail::try_from(x).ok())
			.collect();
		Ok(likes)
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

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProfileDto {
	first_name: String,
	last_name: String,
	gender: Option<Gender>,
	sexual_preference: SexualPreference,
	biography: Option<String>,
	interests: Vec<String>,
	pub images: Vec<ImageDto>,
	pub likes: Option<Vec<ProfileThumbnail>>,
	pub visits: Option<Vec<ProfileThumbnail>>,
}

impl TryFrom<&ProfileSlice> for ProfileThumbnail {
	type Error = AppError;

	fn try_from(pv: &ProfileSlice) -> Result<Self, Self::Error> {
		if let Some(main_image) = pv.images.iter().find(|x| x.is_main) {
			Ok(Self {
				id: pv.key.to_owned(),
				first_name: pv.first_name.to_owned(),
				image: ImageDto::try_from(main_image)?,
			})
		} else {
			Err(AppError::internal("Main image not found"))
		}
	}
}

impl From<Profile> for ProfileDto {
	fn from(profile: Profile) -> Self {
		Self {
			first_name: profile.first_name,
			last_name: profile.last_name,
			gender: profile.gender,
			sexual_preference: profile.sexual_preference,
			biography: profile.biography,
			interests: profile.interests,
			images: vec![],
			likes: None,
			visits: None,
		}
	}
}

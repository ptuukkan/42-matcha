use crate::database::api;
use crate::database::cursor::CursorRequest;
use crate::errors::AppError;
use crate::models::base::CreateResponse;
use crate::models::image::{Image, ImageDto};
use crate::models::location::Location;
use crate::models::location::LocationDto;
use crate::models::user::RegisterFormValues;
use serde::{Deserialize, Serialize};
use chrono::{naive::NaiveDate, Utc};
use serde_with_macros::skip_serializing_none;
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
	pub birth_date: Option<BirthDate>,
	pub gender: Option<Gender>,
	pub sexual_preference: SexualPreference,
	biography: Option<String>,
	interests: Vec<String>,
	pub location_override: bool,
	pub location: String,
	pub images: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BirthDate {
	year: i32,
	month: u32,
	day: u32,
}

#[derive(Debug, Serialize, Deserialize, PartialEq)]
pub enum Gender {
	Male,
	Female,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum SexualPreference {
	Male,
	Female,
	Both,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ProfileFormValues {
	first_name: Option<String>,
	last_name: Option<String>,
	birth_date: Option<String>,
	gender: Option<Gender>,
	pub location_override: Option<bool>,
	pub location: Option<LocationDto>,
	sexual_preference: Option<SexualPreference>,
	biography: Option<String>,
	pub interests: Option<Vec<String>>,
}

impl Profile {
	fn url() -> Result<String, AppError> {
		let db_url: String = env::var("DB_URL")?;
		Ok(db_url + "_api/document/profiles/")
	}

	fn key_url(&self) -> Result<String, AppError> {
		Ok(format!("{}{}", &Self::url()?, self.key))
	}

	fn collection_url() -> Result<String, AppError> {
		let db_url: String = env::var("DB_URL")?;
		Ok(db_url + "_api/collection/profiles/")
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

	pub async fn get_all() -> Result<Vec<Self>, AppError> {
		let query = "FOR p IN profiles return p";
		let result = CursorRequest::from(query)
			.send()
			.await?
			.extract_all::<Self>()
			.await?;
		Ok(result)
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
		self.birth_date.is_some()
			&& self.gender.is_some()
			&& self.biography.is_some()
			&& !self.images.is_empty()
			&& !self.interests.is_empty()
	}

	pub async fn count() -> Result<usize, AppError> {
		let url = format!("{}count", Self::collection_url()?);
		let res: api::ArangoCollectionCount = api::get(&url).await?;
		Ok(res.count)
	}
}

impl From<&RegisterFormValues> for Profile {
	fn from(values: &RegisterFormValues) -> Self {
		Self {
			key: "".to_owned(),
			first_name: values.first_name.to_owned(),
			last_name: values.last_name.to_owned(),
			birth_date: None,
			gender: None,
			sexual_preference: SexualPreference::Both,
			biography: None,
			location_override: false,
			location: String::new(),
			interests: vec![],
			images: vec![],
		}
	}
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

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PrivateProfileDto {
	first_name: String,
	last_name: String,
	birth_date: Option<BirthDate>,
	gender: Option<Gender>,
	sexual_preference: SexualPreference,
	biography: Option<String>,
	interests: Vec<String>,
	location_override: bool,
	pub location: LocationDto,
	pub fame_rating: usize,
	pub images: Vec<ImageDto>,
	pub likes: Vec<ProfileThumbnail>,
	pub visits: Vec<ProfileThumbnail>,
}

impl From<Profile> for PrivateProfileDto {
	fn from(profile: Profile) -> Self {
		Self {
			first_name: profile.first_name,
			last_name: profile.last_name,
			birth_date: profile.birth_date,
			gender: profile.gender,
			sexual_preference: profile.sexual_preference,
			biography: profile.biography,
			interests: profile.interests,
			fame_rating: 0,
			location_override: profile.location_override,
			location: LocationDto::from(Location::new()),
			images: vec![],
			likes: vec![],
			visits: vec![],
		}
	}
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PublicProfileDto {
	pub id: String,
	first_name: String,
	last_name: String,
	age: u8,
	gender: Option<Gender>,
	sexual_preference: SexualPreference,
	biography: Option<String>,
	interests: Vec<String>,
	pub fame_rating: usize,
	pub images: Vec<ImageDto>,
	pub connected: bool,
	pub liked: bool,
}

impl From<Profile> for PublicProfileDto {
	fn from(profile: Profile) -> Self {
		let today = Utc::today();
		let birth_date = NaiveDate::fom
		today.
		Self {
			id: profile.key,
			first_name: profile.first_name,
			last_name: profile.last_name,
			gender: profile.gender,
			sexual_preference: profile.sexual_preference,
			biography: profile.biography,
			interests: profile.interests,
			fame_rating: 0,
			images: vec![],
			connected: false,
			liked: false,
		}
	}
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

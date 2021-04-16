use crate::database::api;
use crate::database::cursor::CursorRequest;
use crate::errors::AppError;
use crate::models::base::CreateResponse;
use crate::models::image::{Image, ImageDto};
use crate::models::location::Location;
use crate::models::location::LocationDto;
use crate::models::user::RegisterFormValues;

use chrono_humanize::{Accuracy, HumanTime, Tense};
use serde::{Deserialize, Serialize};
use chrono::{naive::NaiveDate, Utc, Datelike, DateTime};
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
	pub birth_date: Option<String>,
	pub gender: Option<Gender>,
	pub sexual_preference: SexualPreference,
	biography: Option<String>,
	pub interests: Vec<String>,
	pub location_override: bool,
	pub location: String,
	pub images: Vec<String>,
	pub last_seen: String,
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
	pub birth_date: Option<String>,
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

	pub fn age(&self) -> Result<u8, AppError> {
		if let Some(birth_date) = &self.birth_date {
			let today = Utc::today();
			let birth_date = NaiveDate::parse_from_str(&birth_date, "%Y-%m-%d")?;
			let mut age = today.year() as u8 - birth_date.year() as u8;
			if today.ordinal() < birth_date.ordinal() {
				age -= 1;
			}
			Ok(age)
		} else {
			Ok(0)
		}
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
			last_seen: String::from("Never"),
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
	pub id: String,
	first_name: String,
	last_name: String,
	birth_date: Option<String>,
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
			id: profile.key,
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
	pub age: u8,
	gender: Option<Gender>,
	sexual_preference: SexualPreference,
	biography: Option<String>,
	pub interests: Vec<String>,
	pub last_seen: String,
	pub distance: i32,
	pub fame_rating: usize,
	pub images: Vec<ImageDto>,
	pub connected: bool,
	pub liked: bool,
	pub compatibility_rating: u8,
	pub mutual_interests: i32,
	pub blocked: bool,
}

impl TryFrom<Profile> for PublicProfileDto {
	type Error = AppError;

	fn try_from(profile: Profile) -> Result<Self, Self::Error> {
		let age = profile.age()?;
		let last_seen;
		if let Ok(last_seen_date) = DateTime::parse_from_str(&profile.last_seen, "%Y-%m-%d %H:%M:%S %z") {
			last_seen = HumanTime::from(last_seen_date).to_text_en(Accuracy::Rough, Tense::Past);
		} else {
			last_seen = profile.last_seen;
		}
		
		Ok(Self {
			last_seen,
			id: profile.key,
			first_name: profile.first_name,
			last_name: profile.last_name,
			age,
			gender: profile.gender,
			sexual_preference: profile.sexual_preference,
			biography: profile.biography,
			interests: profile.interests,
			fame_rating: 0,
			distance: 0,
			images: vec![],
			connected: false,
			liked: false,
			compatibility_rating: 0,
			mutual_interests: 0,
			blocked: false,
		})
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
	pub id: String,
	first_name: String,
	image: ImageDto,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProfileWithDistance {
	pub profile: Profile,
	pub distance: i32,
}

impl ProfileWithDistance {
	pub async fn get(my_profile: &str, their_profile: &str) -> Result<Self, AppError> {
		let query = format!(
			"LET my_location = (FOR p IN profiles FILTER p._key == '{m}' RETURN DOCUMENT('locations', p.location))
			LET their_location = (FOR p IN profiles FILTER p._key == '{t}' RETURN DOCUMENT('locations', p.location))
			LET their_profile = (FOR p IN profiles FILTER p._key == '{t}' RETURN p)
			LET distance = DISTANCE(their_location[0].coordinate[0], their_location[0].coordinate[1], my_location[0].coordinate[0], my_location[0].coordinate[1])
			RETURN {{ profile: their_profile[0], distance: ROUND(distance / 1000) }}
	  		",
			m = &my_profile, t = &their_profile
		);
		let mut result = CursorRequest::from(query)
			.send()
			.await?
			.extract_all::<Self>()
			.await?;
		if let Some(profile) = result.pop() {
			Ok(profile)
		} else {
			Err(AppError::not_found("Profile not found"))
		}
	}

	pub async fn get_all(profile_key: &str) -> Result<Vec<Self>, AppError> {
		let query = format!(
			"LET locat = (FOR p IN profiles FILTER p._key == \"{}\" RETURN DOCUMENT(\"locations\", p.location))

			FOR loc IN locations
			  LET distance = DISTANCE(loc.coordinate[0], loc.coordinate[1], locat[0].coordinate[0], locat[0].coordinate[1])
			  FOR p IN profiles FILTER p.location == loc._key RETURN {{ profile: p, distance: ROUND(distance / 1000) }}
	  		",
			&profile_key
		);
		let result = CursorRequest::from(query)
			.send()
			.await?
			.extract_all::<Self>()
			.await?;
		Ok(result)
	}
}

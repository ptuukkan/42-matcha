use crate::errors::AppError;
use crate::models::image::{Image, ImageDto};
use crate::models::like::Like;
use crate::models::location::Location;
use crate::models::location::LocationDto;
use crate::models::profile::ProfileWithDistance;
use crate::models::profile::{PrivateProfileDto, Profile, ProfileFormValues, PublicProfileDto};
use crate::models::user::User;
use crate::models::visit::Visit;
use chrono::naive::NaiveDate;
use serde_json::{json, Value};
use std::convert::TryFrom;

pub mod image;
pub mod interest;
pub mod location;

pub async fn get_my(user: &User) -> Result<PrivateProfileDto, AppError> {
	let profile = Profile::get(&user.profile).await?;
	let images: Vec<ImageDto> = profile
		.get_images()
		.await?
		.iter()
		.filter_map(|x| ImageDto::try_from(x).ok())
		.collect();
	let visits = Visit::find_inbound(&profile.key).await?;
	let location = Location::get(&profile.location).await?;
	let likes = Like::find_inbound(&profile.key).await?;
	let fame = fame_rating(&profile.key).await?;
	let mut profile_dto = PrivateProfileDto::from(profile);
	profile_dto.location = LocationDto::from(location);
	profile_dto.images = images;
	profile_dto.visits = visits;
	profile_dto.likes = likes;
	profile_dto.fame_rating = fame;

	Ok(profile_dto)
}

pub async fn update(user: &User, mut values: ProfileFormValues) -> Result<(), AppError> {
	let profile = Profile::get(&user.profile).await?;
	if values.location_override.is_some() && values.location.is_some() {
		let ol = values.location_override.unwrap();
		if ol {
			let loc = values.location.unwrap();
			let mut profile_location = Location::get(&profile.location).await?;
			profile_location.coordinate = vec![loc.latitude, loc.longitude];
			profile_location.update().await?;
		}
	}
	values.location = None;
	if let Some(interests) = values.interests {
		values.interests = interest::create(interests).await?;
	}
	if let Some(birth_date) = values.birth_date {
		let split: Vec<&str> = birth_date.split('T').collect();
		println!("'{}'", split[0]);
		NaiveDate::parse_from_str(split[0], "%Y-%m-%d")?;
		if NaiveDate::parse_from_str(split[0], "%Y-%m-%d").is_ok() {
			values.birth_date = Some(split[0].to_owned());
		} else {
			return Err(AppError::bad_request("Birth date format incorrect"));
		}
	}
	profile.update_from_form(&values).await?;
	Ok(())
}

pub async fn get(user: &User, profile_key: &str) -> Result<PublicProfileDto, AppError> {
	let profile = ProfileWithDistance::get(&user.profile, profile_key).await?;
	// if !profile.is_complete() {
	// 	return Err(AppError::not_found("Profile not found"));
	// }
	if user.profile != profile.profile.key {
		visit(&user.profile, profile_key).await?;
	}

	let profile_dto = load_profile_dto(user, profile).await?;
	Ok(profile_dto)
}

pub async fn visit(from: &str, to: &str) -> Result<(), AppError> {
	if Visit::find(from, to).await?.is_some() {
		Ok(())
	} else {
		let visit = Visit::new(from, to);
		visit.create().await?;
		Ok(())
	}
}

pub async fn like(user: &User, profile_key: &str) -> Result<Value, AppError> {
	if Like::find(&user.profile, profile_key).await?.is_some() {
		Err(AppError::bad_request("Already liked this profile"))
	} else {
		let like = Like::new(&user.profile, profile_key);
		like.create().await?;
		let res: Value;
		if Like::find(profile_key, &user.profile).await?.is_some() {
			res = json!({"connected": true});
		} else {
			res = json!({"connected": false});
		}
		Ok(res)
	}
}

pub async fn unlike(user: &User, profile_key: &str) -> Result<(), AppError> {
	if let Some(like) = Like::find(&user.profile, profile_key).await? {
		like.delete().await?;
		Ok(())
	} else {
		Err(AppError::bad_request("Like not found"))
	}
}

async fn fame_rating(profile_key: &str) -> Result<usize, AppError> {
	let total_likes = Like::count().await?;
	let total_visits = Visit::count().await?;
	let total_profiles = Profile::count().await?;
	let profile_visits = Visit::find_inbound(profile_key).await?.len();
	let profile_likes = Like::find_inbound(profile_key).await?.len();
	let avg = (total_likes + total_visits) as f32 / total_profiles as f32;
	let mut fame: f32;
	if profile_visits + profile_likes == 0 {
		fame = 0.0;
	} else {
		fame = (profile_likes + profile_visits) as f32 / avg * 5.0;
		if fame > 10.0 {
			fame = 10.0;
		}
	}
	Ok(fame as usize)
}

pub async fn load_profile_dto(
	user: &User,
	profile_with_distance: ProfileWithDistance,
) -> Result<PublicProfileDto, AppError> {
	let images: Vec<ImageDto> = Image::get_profile_images(&profile_with_distance.profile.key)
		.await?
		.iter()
		.filter_map(|x| ImageDto::try_from(x).ok())
		.collect();
	let key = profile_with_distance.profile.key.to_owned();
	let mut profile_dto = PublicProfileDto::try_from(profile_with_distance.profile)?;
	profile_dto.images = images;
	profile_dto.distance = profile_with_distance.distance;
	profile_dto.liked = Like::find(&user.profile, &key).await?.is_some();
	if profile_dto.liked && Like::find(&key, &user.profile).await?.is_some() {
		profile_dto.connected = true;
	}
	profile_dto.fame_rating = fame_rating(&key).await?;
	Ok(profile_dto)
}

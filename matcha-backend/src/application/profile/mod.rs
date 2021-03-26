use crate::errors::AppError;
use crate::models::image::ImageDto;
use crate::models::like::Like;
use crate::models::profile::{PrivateProfileDto, Profile, ProfileFormValues, PublicProfileDto};
use crate::models::user::User;
use crate::models::visit::Visit;
use serde_json::{json, Value};
use std::convert::TryFrom;

pub mod image;
pub mod interest;

pub async fn get_my(user: User) -> Result<PrivateProfileDto, AppError> {
	let profile = Profile::get(&user.profile).await?;
	let images: Vec<ImageDto> = profile
		.get_images()
		.await?
		.iter()
		.filter_map(|x| ImageDto::try_from(x).ok())
		.collect();
	let visits = Visit::find_inbound(&profile.key).await?;
	let likes = Like::find_inbound(&profile.key).await?;
	let fame = fame_rating(&profile.key).await?;
	let mut profile_dto = PrivateProfileDto::from(profile);
	profile_dto.images = images;
	profile_dto.visits = visits;
	profile_dto.likes = likes;
	profile_dto.fame_rating = fame;

	Ok(profile_dto)
}

pub async fn update(user: User, mut values: ProfileFormValues) -> Result<(), AppError> {
	let profile = Profile::get(&user.profile).await?;
	if let Some(interests) = values.interests {
		values.interests = interest::create(interests).await?;
	}
	profile.update_from_form(&values).await?;
	Ok(())
}

pub async fn get(user: User, id: &str) -> Result<PublicProfileDto, AppError> {
	let profile = Profile::get(id).await?;
	// if !profile.is_complete() {
	// 	return Err(AppError::not_found("Profile not found"));
	// }
	if user.profile != profile.key {
		visit(&user.profile, id).await?;
	}

	let images: Vec<ImageDto> = profile
		.get_images()
		.await?
		.iter()
		.filter_map(|x| ImageDto::try_from(x).ok())
		.collect();
	let mut profile_dto = PublicProfileDto::from(profile);
	profile_dto.images = images;
	profile_dto.liked = Like::find(&user.profile, id).await?.is_some();
	if profile_dto.liked && Like::find(id, &user.profile).await?.is_some() {
		profile_dto.connected = true;
	}
	profile_dto.fame_rating = fame_rating(&id).await?;
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
	let avg = (total_likes + total_visits) / total_profiles;
	let mut fame: usize;
	if profile_visits + profile_likes == 0 {
		fame = 0;
	} else {
		fame = (profile_likes + profile_visits) / avg * 5;
		if fame > 10 {
			fame = 10;
		}
	}
	Ok(fame)
}

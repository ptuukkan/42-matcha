use crate::models::image::ImageDto;
use crate::models::profile::Profile;
use crate::errors::AppError;
use crate::models::profile::{ProfileDto, ProfileFormValues};
use crate::models::user::User;
use std::convert::TryFrom;

pub mod image;
pub mod interest;

pub async fn get_my(user: User) -> Result<ProfileDto, AppError> {
	let profile = Profile::get(&user.profile).await?;
	let images: Vec<ImageDto> = profile
		.get_images()
		.await?
		.iter()
		.filter_map(|x| ImageDto::try_from(x).ok())
		.collect();
	let visits = profile.get_visits().await?;
	let likes = profile.get_likes().await?;
	let mut profile_dto = ProfileDto::from(profile);
	profile_dto.images = images;
	profile_dto.visits = Some(visits);
	profile_dto.likes = Some(likes);

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

pub async fn get(user: User, id: &str) -> Result<ProfileDto, AppError> {
	let profile = Profile::get(id).await?;
	// if !profile.is_complete() {
	// 	return Err(AppError::not_found("Profile not found"));
	// }
	if user.profile != profile.key {
		profile.visit(&user.profile).await?;
	}

	let images: Vec<ImageDto> = profile
		.get_images()
		.await?
		.iter()
		.filter_map(|x| ImageDto::try_from(x).ok())
		.collect();
	let mut profile_dto = ProfileDto::from(profile);
	profile_dto.images = images;
	Ok(profile_dto)
}

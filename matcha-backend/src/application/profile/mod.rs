use crate::models::profile::Profile;
use crate::errors::AppError;
use crate::infrastructure::security::jwt;
use crate::models::image::ImageDto;
use crate::models::profile::{ProfileDto, ProfileFormValues};
use crate::models::user::User;
use actix_web::HttpRequest;
use std::convert::TryFrom;

pub mod image;
pub mod interest;

pub async fn get_my(req: HttpRequest) -> Result<ProfileDto, AppError> {
	let user_key = jwt::decode_from_header(&req)?;
	let user = User::get(&user_key).await?;
	let profile = user.get_profile().await?;
	let images = profile.get_images().await?;
	let mut profile_dto = ProfileDto::from(profile);
	profile_dto.images = images
		.into_iter()
		.filter_map(|x| ImageDto::try_from(&x).ok())
		.collect();
	Ok(profile_dto)
}

pub async fn update(req: HttpRequest, mut values: ProfileFormValues) -> Result<(), AppError> {
	let user_key = jwt::decode_from_header(&req)?;
	let user = User::get(&user_key).await?;
	let profile = user.get_profile().await?;
	if let Some(interests) = values.interests {
		values.interests = interest::create(interests).await?;
	}
	profile.update_from_form(&values).await?;
	Ok(())
}

pub async fn get(user: User, id: &str) -> Result<ProfileDto, AppError> {
	let profile = Profile::get(id).await?;
	if !profile.is_complete() {
		return Err(AppError::not_found("Profile not found"));
	}
	println!("{:?}", user);

	Ok(ProfileDto::from(profile))
}

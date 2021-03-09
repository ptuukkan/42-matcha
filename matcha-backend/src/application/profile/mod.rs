use crate::models::image::ImageDto;
use crate::errors::AppError;
use crate::infrastructure::security::jwt;
use crate::models::profile::{ProfileDto, ProfileFormValues};
use crate::models::user::User;
use actix_web::HttpRequest;
use std::convert::TryFrom;

pub mod image;

pub async fn get_my(req: HttpRequest) -> Result<ProfileDto, AppError> {
	println!("start");
	let user_key = jwt::decode_from_header(req)?;
	println!("user_key");
	let user = User::get(&user_key).await?;
	println!("user");
	let profile = user.get_profile().await?;
	println!("profile");
	let images = profile.get_images().await?;
	println!("images");
	let mut profile_dto = ProfileDto::from(profile);
	println!("profiledto");
	profile_dto.images = images
		.into_iter()
		.filter_map(|x| ImageDto::try_from(&x).ok())
		.collect();
	Ok(profile_dto)
}

pub async fn edit(req: HttpRequest, values: ProfileFormValues) -> Result<(), AppError> {
	let user_key = jwt::decode_from_header(req)?;
	let user = User::get(&user_key).await?;
	let profile = user.get_profile().await?;
	profile.update_from_form(&values).await?;
	Ok(())
}

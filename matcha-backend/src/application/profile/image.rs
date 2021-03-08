use crate::errors::AppError;
use crate::infrastructure::image::image_accessor;
use crate::infrastructure::security::jwt;
use crate::models::image::Image;
use crate::models::image::ImageDto;
use crate::models::user::User;
use actix_web::HttpRequest;
use std::convert::TryFrom;

pub async fn create(req: HttpRequest, mut parts: awmp::Parts) -> Result<ImageDto, AppError> {
	let user_key = jwt::decode_from_header(req)?;
	let user = User::get(&user_key).await?;
	if let Some(image_file) = parts.files.take("image").pop() {
		let mut profile = user.get_profile().await?;
		if profile.images.len() > 4 {
			return Err(AppError::bad_request("Only five images allowerd"));
		}
		let mut image = Image::new();
		if profile.images.is_empty() {
			image.is_main = true;
		}
		image.create().await?;
		image_accessor::save_image(image_file, &image.key)?;
		profile.images.push(image.key.to_owned());
		profile.update().await?;
		Ok(ImageDto::try_from(&image)?)
	} else {
		return Err(AppError::bad_request("No image found in input data"));
	}
}

pub async fn set_main(req: HttpRequest, id: &str) -> Result<(), AppError> {
	let user_key = jwt::decode_from_header(req)?;
	let user = User::get(&user_key).await?;
	let profile = user.get_profile().await?;
	if !profile.images.contains(&id.to_owned()) {
		return Err(AppError::unauthorized(
			"Cannot set main other images than yours",
		));
	}
	let images = profile.get_images().await?;
	let mut new_main = Image::get(id).await?;
	new_main.is_main = true;
	new_main.update().await?;
	if let Some(mut old_main) = images.into_iter().find(|x| x.is_main) {
		old_main.is_main = false;
		old_main.update().await?;
	}
	Ok(())
}
pub async fn delete(req: HttpRequest, id: &str) -> Result<(), AppError> {
	let user_key = jwt::decode_from_header(req)?;
	let user = User::get(&user_key).await?;
	let mut profile = user.get_profile().await?;
	if !profile.images.contains(&id.to_owned()) {
		return Err(AppError::unauthorized(
			"Cannot delete other images than yours",
		));
	}
	let image = Image::get(id).await?;
	if image.is_main {
		return Err(AppError::bad_request("Cannot delete main image"));
	}
	profile.images.retain(|x| x != id);
	profile.update().await?;
	image.delete().await?;
	image_accessor::delete_image(id)?;
	Ok(())
}

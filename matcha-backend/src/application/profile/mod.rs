use crate::errors::AppError;
use crate::infrastructure::security::jwt;
use crate::models::profile::{ProfileDto, ProfileFormValues};
use crate::models::user::User;
use actix_web::HttpRequest;

pub mod image;

pub async fn get_my(req: HttpRequest) -> Result<ProfileDto, AppError> {
	let user_key = jwt::decode_from_header(req)?;
	let user = User::get(&user_key).await?;
	if let Some(profile) = user.get_profile_dto().await?.pop() {
		Ok(profile)
	} else {
		Err(AppError::internal("Could not find profile"))
	}
}

pub async fn edit(req: HttpRequest, values: ProfileFormValues) -> Result<(), AppError> {
	let user_key = jwt::decode_from_header(req)?;
	let user = User::get(&user_key).await?;
	let profile = user.get_profile().await?;
	profile.update_from_form(&values).await?;
	Ok(())
}

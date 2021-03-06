use crate::errors::AppError;
use crate::infrastructure::security::jwt;
use crate::models::profile::{Profile, ProfileFormValues};
use crate::models::user::User;
use actix_web::HttpRequest;

pub mod image;

pub async fn create(req: HttpRequest, values: ProfileFormValues) -> Result<(), AppError> {
	let user_key = jwt::decode_from_header(req)?;
	let mut user = User::get(&user_key).await?;
	let mut profile = Profile::from(values);
	profile.create().await?;
	user.profile = Some(profile.key);
	user.update().await?;
	Ok(())
}

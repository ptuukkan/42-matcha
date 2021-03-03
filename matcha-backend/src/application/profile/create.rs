use actix_web::HttpRequest;
use crate::errors::AppError;
use crate::models::profile::{ProfileFormValues, Profile};
use crate::models::user::User;
use crate::infrastructure::security::jwt;

pub async fn create(req: HttpRequest, values: ProfileFormValues) -> Result<(), AppError> {
	let user_key = jwt::decode_from_header(req)?;
	let mut user = User::get(&user_key).await?;
	let profile = Profile::from(values);
	let profile_key = profile.create().await?;
	user.profile = Some(profile_key);
	user.update().await?;
	Ok(())
}

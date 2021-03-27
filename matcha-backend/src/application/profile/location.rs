use crate::errors::AppError;
use crate::models::location::Location;
use crate::models::location::LocationInput;
use crate::models::profile::Profile;
use crate::models::user::User;

pub async fn create() -> Result<String, AppError> {
	let mut location = Location::new();
	location.create().await?;
	Ok(location.key)
}

pub async fn update(user: &User, location_input: LocationInput) -> Result<(), AppError> {
	let profile = Profile::get(&user.profile).await?;
	if profile.location_override {
		return Ok(())
	}
	let mut location = Location::get(&profile.location).await?;
	location.coordinate = vec![location_input.latitude, location_input.longitude];
	location.update().await?;
	Ok(())
}

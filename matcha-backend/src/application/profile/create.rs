use crate::errors::AppError;
use crate::models::profile::{ProfileFormValues, Profile};

pub async fn create(values: ProfileFormValues) -> Result<(), AppError> {
	let key = Profile::from(values);

	Ok(())
}

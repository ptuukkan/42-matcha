use crate::errors::{AppError, ValidationError};
use crate::models::user::CredentialChangeValues;
use crate::models::user::User;


pub async fn change(mut user: User, values: CredentialChangeValues) -> Result<(), AppError> {
	let mut validation_error = ValidationError::empty();
	if user.email_address != values.email_address && !User::find("emailAddress", &user.email_address).await?.is_empty() {
		validation_error.add("emailAddress", "Email Address is already in use");
	}
	if !validation_error.errors.is_empty() {
		return Err(AppError::ValidationError(validation_error));
	}
	user.change_password(&values.password).await?;
	user.change_email(&values.email_address).await?; 
	Ok(())
}

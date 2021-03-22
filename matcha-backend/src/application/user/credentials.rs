use actix_web::HttpRequest;
use crate::errors::{AppError, ValidationError};
use crate::models::user::CredentialChangeValues;
use crate::infrastructure::security::jwt;
use crate::models::user::User;


pub async fn change(req: HttpRequest, values: CredentialChangeValues) -> Result<(), AppError> {
	let user_key = jwt::decode_from_header(&req)?;
	if let Some(mut user) = User::find("_key", &user_key)
		.await?
		.pop()
	{
		let mut validation_error = ValidationError::empty();
		if &user.email_address != &values.email_address && !User::find("emailAddress", &user.email_address)
			.await?
			.is_empty()
		{
			validation_error.add("emailAddress", "Email address is already in use");
		}
		if !validation_error.errors.is_empty() {
			return Err(AppError::ValidationError(validation_error));
		}
		user.change_password(&values.password).await?;
		user.change_email(&values.email_address).await?;
	} else {
	return Err(AppError::bad_request("Invalid Token"));
	}
	Ok(())
}

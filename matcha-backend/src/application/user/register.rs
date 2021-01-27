
use crate::errors::{AppError, AppErrorType, FieldError};
use crate::models::user::{RegisterFormValues, User};
use crate::database::cursor::{CursorRequest};
use std::str::FromStr;


pub async fn register(values: RegisterFormValues) -> Result<(), AppError> {
	let user = User::from(values);
	let mut field_errors: Vec<FieldError> = Vec::new();

	let check_existing_email = CursorRequest::from(format!("FOR u IN users filter u.email_address == '{}' return u", user.email_address))
		.send()
		.await?
		.extract_all::<User>()
		.await?;
	if !check_existing_email.is_empty() {
		let error = FieldError::from_str("emailAddress:Email address is already in use").unwrap();
		field_errors.push(error);
	}

	let check_existing_username = CursorRequest::from(format!("FOR u IN users filter u.user_name == '{}' return u", user.user_name))
		.send()
		.await?
		.extract_all::<User>()
		.await?;
	if !check_existing_username.is_empty() {
		let error = FieldError::from_str("userName:Username is already in use").unwrap();
		field_errors.push(error);
	}

	if !field_errors.is_empty() {
		return Err(AppError{
			error: AppErrorType::ValidationError(field_errors)
		})
	}

	user.create().await?;

	Ok(())
}


use crate::errors::{AppError, LoginError};
use crate::models::user::{LoginFormValues, User};
use crate::database::cursor::{CursorRequest};

pub async fn login(values: LoginFormValues) -> Result<(), AppError> {
	let result = CursorRequest::from(format!("FOR u IN users filter u.email_address == '{}' filter u.password == '{}' return u", values.email_address, values.password))
		.send()
		.await?
		.extract_all::<User>()
		.await?;
	if result.is_empty() {
		return Err(AppError::LoginError(LoginError::new("Login failed")))
	}

	Ok(())
}

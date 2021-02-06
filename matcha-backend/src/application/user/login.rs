
use crate::errors::{AppError};
use crate::models::user::{LoginFormValues, User};
use crate::database::cursor::{CursorRequest};

pub async fn login(values: LoginFormValues) -> Result<(), AppError> {
	let mut result = CursorRequest::from(format!("FOR u IN users filter u.email_address == '{}'return u", values.email_address))
		.send()
		.await?
		.extract_all::<User>()
		.await?;
	if let Some(user) = result.pop() {
		if !user.verify_pw(&values.password) {
			return Err(AppError::unauthorized("Login failed"));
		}
	} else {
		return Err(AppError::unauthorized("Login failed"));
	}
	Ok(())
}

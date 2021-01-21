
use crate::errors::{AppError, AppErrorType};
use crate::models::user::{RegisterFormValues, User};
use crate::database::cursor::{CursorRequest};
use actix_web::error::Error;
use std::convert::TryFrom;


pub async fn register(values: RegisterFormValues) -> Result<(), AppError> {
	let user = User::try_from(values)?;

	let check_existing_email = CursorRequest::from(format!("FOR u IN users return u")) //filter u.email_address == '{}' return u", user.email_address))
		.send()
		.await?
		.extract_all::<User>()
		.await?;
	println!("{:?}", check_existing_email);
	if !check_existing_email.is_empty() {
		return Err(AppError {
			error: AppErrorType::ValidationError("Email address is already in use".to_owned())
		})
	}

	Ok(())
}

use actix_web::HttpRequest;
use crate::models::user::ChangeCredentialValues;
use crate::database::cursor::CursorRequest;
use crate::errors::{AppError, ValidationError};
use crate::models::profile::Profile;
use crate::infrastructure::security::jwt;
use crate::models::user::RegisterFormValues;
use crate::models::user::User;

pub async fn change(req: HttpRequest, values: ChangeCredentialValues) -> Result<(), AppError> {
	let user_key = jwt::decode_from_header(&req)?;
	println!("{:#?}", user_key);
	if let Some(user) = User::find("_key", &user_key)
		.await?
		.pop()
	{
		println!("{:#?}",user);
		let mut validation_error = ValidationError::empty();
		if !User::find("emailAddress", &user.email_address)
			.await?
			.is_empty()
		{
			validation_error.add("emailAddress", "Email address is already in use");
		}
		if !User::find("username", &user.username).await?.is_empty() {
			validation_error.add("username", "Username is already in use");
		}
		//Change both
		user.change_password(&values.password).await?;
		} else {
		return Err(AppError::bad_request("Something went wrong"));
	}
	Ok(())
}
use crate::errors::ValidationError;
use crate::errors::AppError;
use crate::infrastructure::security::jwt;
use crate::models::user::{LoginFormValues, LoginResponse, User};
use serde::Deserialize;
use regex::Regex;

pub mod password;
pub mod register;

pub async fn login(values: LoginFormValues) -> Result<LoginResponse, AppError> {
	values.validate()?;
	if let Some(user) = User::find("emailAddress", &values.email_address)
		.await?
		.pop()
	{
		if !user.verify_pw(&values.password) {
			return Err(AppError::unauthorized("Login failed"));
		}
		if user.link.is_some() {
			return Err(AppError::unauthorized("Please verify your account!"));
		}
		let token = jwt::create_token(&user)?;
		Ok(user.login_response(&token).await?)
	} else {
		return Err(AppError::unauthorized("Login failed"));
	}
}

pub async fn change_credentials(mut user: User, values: CredentialChangeValues) -> Result<(), AppError> {
	values.validate().await?;
	user.change_password(&values.password).await?;
	user.change_email(&values.email_address).await?;
	Ok(())
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct CredentialChangeValues {
	pub email_address: String,
	pub password: String,
}

impl CredentialChangeValues {
	pub async fn validate(&self) -> Result<(), AppError> {
		let email = Regex::new(r"^\S+@\S+\.\S+$").unwrap();
		if !email.is_match(&self.email_address) {
			return Err(AppError::bad_request("invalid data"));
		}
		if self.password.len() < 8 || self.password.len() > 99 {
			return Err(AppError::bad_request("invalid data"));
		}
		let mut validation_error = ValidationError::empty();
		if !User::find("emailAddress", &self.email_address)
			.await?
			.is_empty()
		{
			validation_error.add("emailAddress", "Email address is already in use");
			return Err(AppError::ValidationError(validation_error));
		}
		Ok(())
	}
}



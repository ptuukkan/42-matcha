use crate::errors::AppError;
use crate::models::user::User;
use lettre::{SendableEmail, SendmailTransport, Transport};
use lettre_email::EmailBuilder;
use nanoid::nanoid;
use std::env;
use serde::Deserialize;
use regex::Regex;

pub async fn reset(values: ResetFormValues) -> Result<(), AppError> {
	values.validate()?;
	if let Some(mut user) = User::find("emailAddress", &values.email_address)
		.await?
		.pop()
	{
		let link = nanoid!(10, &nanoid::alphabet::SAFE);
		user.link = Some(link.to_owned());
		user.update().await?;
		send_reset_email(values.email_address, link)?
	}
	Ok(())
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ResetFormValues {
	pub email_address: String,
}

impl ResetFormValues {
	pub fn validate(&self) -> Result<(), AppError> {
		let email = Regex::new(r"^\S+@\S+\.\S+$").unwrap();
		if !email.is_match(&self.email_address) {
			return Err(AppError::bad_request("invalid data"));
		}
		Ok(())
	}
}

fn send_reset_email(email: String, link: String) -> Result<(), AppError> {
	let app_url: String = env::var("APP_URL")?;
	let html_text = format!(
		"
		<h2>Restore your password!!</h2>
		<br>
		<p>
		To restore your password please click <a href=\"{}resetpassword/{}\">here</a>.
		</p>",
		app_url, link
	);

	let email = EmailBuilder::new()
		.to(email)
		.from("no-reply@matcha.com")
		.subject("Matcha password reset!")
		.html(html_text)
		.build()?;
	let email: SendableEmail = email.into();

	let mut sender = SendmailTransport::new();
	sender.send(email)?;
	Ok(())
}

pub async fn reset_password(link: &str, values: ResetPasswordValues) -> Result<(), AppError> {
	values.validate()?;
	if let Some(mut user) = User::find("link", link).await?.pop() {
		user.change_password(&values.password).await?;
	} else {
		return Err(AppError::bad_request("Link is invalid"));
	}
	Ok(())
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ResetPasswordValues {
	pub password: String,
}

impl ResetPasswordValues {
	pub fn validate(&self) -> Result<(), AppError> {
		if self.password.len() < 8 || self.password.len() > 99 {
			return Err(AppError::bad_request("invalid data"));
		}
		Ok(())
	}
}

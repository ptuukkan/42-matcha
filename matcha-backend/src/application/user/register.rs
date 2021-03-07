use crate::models::user::RegisterFormValues;
use crate::database::cursor::CursorRequest;
use crate::errors::{AppError, ValidationError};
use crate::models::profile::Profile;
use crate::models::user::User;
use lettre::{SendableEmail, SendmailTransport, Transport};
use lettre_email::EmailBuilder;
use std::env;


pub async fn register(values: RegisterFormValues) -> Result<(), AppError> {
	let mut user = User::from(&values);
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
	if !validation_error.errors.is_empty() {
		return Err(AppError::ValidationError(validation_error));
	}
	let mut profile = Profile::from(&values);
	profile.create().await?;
	user.profile = profile.key.to_owned();
	if user.create().await.is_err() {
		profile.delete().await?;
		return Err(AppError::internal("Cannot create user"));
	}
	send_verification_email(&user)?;
	Ok(())
}

pub fn send_verification_email(user: &User) -> Result<(), AppError> {
	let app_url: String = env::var("APP_URL")?;
	let link = user.link.as_ref().unwrap();
	let html_text = format!("
		<h2>One step closer to your matchas!</h2>
		<br>
		<p>
		To finish your registeration please click <a href=\"{}verify/{}\">here</a> to confirm/activate your account
		</p>",
	app_url,
	link
	);

	let email = EmailBuilder::new()
		.to(user.email_address.to_string())
		.from("no-reply@matcha.com")
		.subject("Matcha confirmation!")
		.html(html_text)
		.build()?;
	let email: SendableEmail = email.into();

	let mut sender = SendmailTransport::new();
	sender.send(email)?;
	Ok(())
}

pub async fn verify(link: &str) -> Result<(), AppError> {
	let mut result = CursorRequest::from(format!(
		"FOR u IN users filter u.link == '{}' return u",
		link
	))
	.send()
	.await?
	.extract_all::<User>()
	.await?;
	if result.is_empty() {
		return Err(AppError::bad_request(
			"Link is invalid or email address has already been validated",
		));
	}

	if let Some(mut user) = result.pop() {
		user.link = None;
		user.update().await?
	}
	Ok(())
}

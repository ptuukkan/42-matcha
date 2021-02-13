use crate::database::cursor::CursorRequest;
use crate::errors::{AppError, ValidationError};
use crate::models::user::{RegisterFormValues, User};
use lettre::{SendableEmail, SendmailTransport, Transport};
use lettre_email::EmailBuilder;
use std::env;

pub async fn register(values: RegisterFormValues) -> Result<(), AppError> {
	let user = User::from(values);
	let mut validation_error = ValidationError::empty();

	let check_existing_email = CursorRequest::from(format!(
		"FOR u IN users filter u.email_address == '{}' return u",
		user.email_address
	))
		.send()
		.await?
		.extract_all::<User>()
		.await?;
	if !check_existing_email.is_empty() {
		validation_error.add("emailAddress", "Email address is already in use");
	}
	println!("japaaaaoa");
	let check_existing_username = CursorRequest::from(format!(
		"FOR u IN users filter u.username == '{}' return u",
		user.username
	))
		.send()
		.await?
		.extract_all::<User>()
		.await?;
	if !check_existing_username.is_empty() {
		validation_error.add("username", "Username is already in use");
	}
	println!("japoa");

	if !validation_error.errors.is_empty() {
		return Err(AppError::ValidationError(validation_error));
	}
	send_verification_email(&user)?;

	user.create().await?;

	Ok(())
}

pub fn send_verification_email(user: &User) -> Result<(), AppError> {
	let app_url: String = env::var("APP_URL")?;

	let html_text = format!("
		<h2>One step closer to your matchas!</h2>
		<br>
		<p>
		To finish your registeration please click <a href=\"{}verify/{}\">here</a> to confirm/activate your account
		</p>",
	app_url,
	user.link
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
		)); // Create a new error Verification error instead
	}

	if let Some(mut user) = result.pop() {
		user.link = String::from("");
		user.update().await?
	}
	Ok(())
}

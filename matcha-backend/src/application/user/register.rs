use crate::database::cursor::CursorRequest;
use crate::errors::{AppError, ValidationError};
use crate::models::user::{RegisterFormValues, User};
use lettre::{SendableEmail, Transport, SendmailTransport};
use lettre_email::EmailBuilder;

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

	let check_existing_username = CursorRequest::from(format!(
		"FOR u IN users filter u.user_name == '{}' return u",
		user.user_name
	))
	.send()
	.await?
	.extract_all::<User>()
	.await?;
	if !check_existing_username.is_empty() {
		validation_error.add("userName", "Username is already in use");
	}

	if !validation_error.errors.is_empty() {
		return Err(AppError::ValidationError(validation_error));
	}

	if validation_error.errors.is_empty() {
		let email = EmailBuilder::new()
			.to(user.email_address.to_string())
			.from("no-reply@matcha.com")
			.subject("Matcha confirmation!")
			.html(
				"
			<h2>One step closer to your matchas!</h2>
			<br>
			<p>
			To finish your registeration please click <a href=\"#\">here</a> to confirm/activate your account
			</p>",
			)
			.build()
			.unwrap();
		let email: SendableEmail = email.into();

		let mut sender = SendmailTransport::new();
		let result = sender.send(email);
		assert!(result.is_ok());
	}

	user.create().await?;

	Ok(())
}

use crate::errors::AppError;
use crate::models::user::{ResetFormValues, ResetPasswordValues, User};
use lettre::{SendableEmail, SendmailTransport, Transport};
use lettre_email::EmailBuilder;
use nanoid::nanoid;
use std::env;

pub async fn reset(values: ResetFormValues) -> Result<(), AppError> {
	if let Some(mut user) = User::find("email_address", &values.email_address)
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
	if let Some(mut user) = User::find("link", link).await?.pop() {
		user.change_password(&values.password).await?;
	} else {
		return Err(AppError::bad_request("Link is invalid"));
	}
	Ok(())
}

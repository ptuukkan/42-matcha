use crate::application::profile::location;
use crate::errors::AppError;
use crate::models::profile::Profile;
use crate::models::user::{RegisterFormValues, User};
use lettre::{SendableEmail, SendmailTransport, Transport};
use lettre_email::EmailBuilder;
use regex::Regex;
use std::env;

pub async fn register(values: RegisterFormValues) -> Result<(), AppError> {
	values.validate().await?;
	let mut user = User::from(&values);
	let mut profile = Profile::from(&values);
	profile.location = location::create().await?;
	profile.create().await?;
	user.profile = profile.key.to_owned();
	if user.create().await.is_err() {
		profile.delete().await?;
		return Err(AppError::internal("Cannot create user"));
	}
	let re = Regex::new(r".*test\.com$").unwrap();
	if re.is_match(&user.email_address) {
		if let Some(mut user) = User::find("emailAddress", &values.email_address)
			.await?
			.pop()
		{
			user.link = None;
			user.update().await?;
		}
	} else {
		send_verification_email(&user)?;
	}
	Ok(())
}

pub fn send_verification_email(user: &User) -> Result<(), AppError> {
	let app_url: String = env::var("APP_URL")?;
	if let Some(link) = &user.link {
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
	} else {
		Err(AppError::internal("No link for user"))
	}
}

pub async fn verify(link: &str) -> Result<(), AppError> {
	if let Some(mut user) = User::find("link", link).await?.pop() {
		user.link = None;
		user.update().await?;
		Ok(())
	} else {
		Err(AppError::bad_request(
			"Link is invalid or email address has already been validated",
		))
	}
}

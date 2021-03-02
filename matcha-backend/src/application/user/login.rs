use crate::database::cursor::CursorRequest;
use lettre::{SendableEmail, SendmailTransport, Transport};
use lettre_email::EmailBuilder;
use crate::errors::AppError;
use crate::models::user::{LoginFormValues, LoginResponse, User, ResetFormValues, ResetPasswordValues};
use actix_web::HttpRequest;
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use nanoid::nanoid;
use std::env;
use std::time::SystemTime;

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
	sub: String,
	iat: usize,
	exp: usize,
}

pub async fn current_user(req: HttpRequest) -> Result<LoginResponse, AppError> {
	if let Some(auth) = req.headers().get("Authorization") {
		let key: String = env::var("SECRET")?;
		if let Some(token) = auth.to_str()?.strip_prefix("Bearer ") {
			let token_data = decode::<Claims>(
				&token,
				&DecodingKey::from_secret(key.as_ref()),
				&Validation::default(),
			)?;
			if let Some(user) = User::find("_key", &token_data.claims.sub).await?.pop() {
				Ok(user.login_response(&token))
			} else {
				Err(AppError::bad_request("User not found"))
			}
		} else {
			Err(AppError::bad_request("Invalid token"))
		}
	} else {
		Err(AppError::bad_request("No authorization header"))
	}
}

pub async fn reset(values: ResetFormValues) -> Result<(), AppError> {
	if let Some(mut user) = User::find("email_address", &values.email_address)
	.await?
	.pop() {
		user.link = Some(nanoid!(10, &nanoid::alphabet::SAFE));
		user.update().await?;
		let link = user.link.unwrap();
		send_reset_email(values.email_address, link)?
	} 
	Ok(())
}

pub async fn reset_password(link: &str, values: ResetPasswordValues) -> Result<(), AppError> {
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
			"Link is invalid",
		));
	}

	if let Some(mut user) = result.pop() {
		user = user.change_password(values.password);
		user.update().await?
	}
	Ok(())
}

pub fn send_reset_email(email: String, link: String) -> Result<(), AppError> {
	let app_url: String = env::var("APP_URL")?;
	let html_text = format!("
		<h2>Restore your password!!</h2>
		<br>
		<p>
		To restore your password please click <a href=\"{}changePassword/{}\">here</a>.
		</p>",
	app_url,
	link
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


pub async fn login(values: LoginFormValues) -> Result<LoginResponse, AppError> {
	if let Some(user) = User::find("email_address", &values.email_address)
		.await?
		.pop()
	{
		if !user.verify_pw(&values.password) {
			return Err(AppError::unauthorized("Login failed"));
		}
		if user.link.is_some() {
			return Err(AppError::unauthorized("Please verify your account!"));
		}
		let iat = SystemTime::now()
			.duration_since(SystemTime::UNIX_EPOCH)?
			.as_secs() as usize;

		let exp = iat + 3600;
		let my_claims = Claims {
			sub: user.key.to_owned(),
			exp,
			iat,
		};

		let key: String = env::var("SECRET")?;
		let token = encode(
			&Header::default(),
			&my_claims,
			&EncodingKey::from_secret(key.as_ref()),
		)?;

		Ok(user.login_response(&token))
	} else {
		return Err(AppError::unauthorized("Login failed"));
	}
}
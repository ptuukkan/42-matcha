use crate::database::api;
use crate::database::cursor::CursorRequest;
use crate::errors::AppError;
use crate::infrastructure::security::jwt;
use crate::models::base::CreateResponse;
use crate::models::profile::Profile;
use actix_web::{dev, FromRequest, HttpRequest};
use actix_web_validator::Validate;
use core::future::Future;
use nanoid::nanoid;
use serde::{Deserialize, Serialize};
use sodiumoxide::crypto::pwhash::argon2id13;
use std::env;
use std::pin::Pin;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct User {
	#[serde(skip_serializing)]
	#[serde(rename = "_key")]
	pub key: String,
	pub email_address: String,
	pub username: String,
	password: String,
	pub link: Option<String>,
	pub profile: String,
}

#[derive(Deserialize, Debug, Validate)]
#[serde(rename_all = "camelCase")]
pub struct RegisterFormValues {
	#[validate(length(min = 2, max = 32))]
	pub first_name: String,
	#[validate(length(min = 2, max = 32))]
	pub last_name: String,
	#[validate(email)]
	email_address: String,
	#[validate(length(min = 2, max = 32))]
	username: String,
	#[validate(length(min = 6))]
	password: String,
}

#[derive(Deserialize, Debug, Validate)]
#[serde(rename_all = "camelCase")]
pub struct CredentialChangeValues {
	#[validate(email)]
	pub email_address: String,
	#[validate(length(min = 6))]
	pub password: String,
}

#[derive(Deserialize, Debug, Validate)]
#[serde(rename_all = "camelCase")]
pub struct LoginFormValues {
	pub email_address: String,
	pub password: String,
}

#[derive(Deserialize, Debug, Validate)]
#[serde(rename_all = "camelCase")]
pub struct ResetFormValues {
	pub email_address: String,
}

#[derive(Deserialize, Debug, Validate)]
#[serde(rename_all = "camelCase")]
pub struct ResetPasswordValues {
	pub password: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct LoginResponse {
	email_address: String,
	pub token: String,
	profile_complete: bool,
}

impl User {
	#[allow(dead_code)]
	pub fn new(email_address: &str, password: &str, username: &str) -> User {
		User {
			key: String::new(),
			email_address: String::from(email_address),
			username: String::from(username),
			password: User::hash_pw(&String::from(password)),
			link: None,
			profile: String::new(),
		}
	}

	pub async fn change_password(&mut self, password: &str) -> Result<(), AppError> {
		self.password = User::hash_pw(password);
		self.link = None;
		self.update().await?;
		Ok(())
	}

	pub async fn change_email(&mut self, email: &str) -> Result<(), AppError> {
		self.email_address = email.to_owned();
		self.update().await?;
		Ok(())
	}

	pub async fn login_response(&self, token: &str) -> Result<LoginResponse, AppError> {
		let profile = Profile::get(&self.profile).await?;
		Ok(LoginResponse {
			email_address: self.email_address.to_owned(),
			token: token.to_owned(),
			profile_complete: profile.is_complete(),
		})
	}

	fn url() -> Result<String, AppError> {
		let db_url: String = env::var("DB_URL")?;
		Ok(db_url + "_api/document/users/")
	}

	fn key_url(&self) -> Result<String, AppError> {
		Ok(format!("{}{}", &Self::url()?, self.key))
	}

	pub async fn create(&self) -> Result<(), AppError> {
		api::post::<Self, CreateResponse>(&Self::url()?, &self).await?;
		Ok(())
	}

	pub async fn update(&self) -> Result<(), AppError> {
		api::patch(&self.key_url()?, &self).await?;
		Ok(())
	}

	pub async fn find(key: &str, value: &str) -> Result<Vec<Self>, AppError> {
		let query = format!("FOR u IN users filter u.{} == '{}' return u", key, value);
		let result = CursorRequest::from(query)
			.send()
			.await?
			.extract_all::<Self>()
			.await?;
		Ok(result)
	}

	pub async fn get(key: &str) -> Result<Self, AppError> {
		let url = format!("{}{}", User::url()?, key);
		let user = api::get::<Self>(&url).await?;
		Ok(user)
	}

	fn hash_pw(password: &str) -> String {
		sodiumoxide::init().unwrap();
		let hash = argon2id13::pwhash(
			password.as_bytes(),
			argon2id13::OPSLIMIT_INTERACTIVE,
			argon2id13::MEMLIMIT_INTERACTIVE,
		)
		.unwrap();
		let texthash = std::str::from_utf8(&hash.0)
			.unwrap()
			.trim_end_matches('\u{0}')
			.to_string();
		texthash
	}

	pub fn verify_pw(&self, password: &str) -> bool {
		sodiumoxide::init().unwrap();
		let mut padded = [0u8; 128];
		self.password
			.as_bytes()
			.iter()
			.enumerate()
			.for_each(|(i, val)| {
				padded[i] = *val;
			});
		match argon2id13::HashedPassword::from_slice(&padded) {
			Some(pw_hash) => argon2id13::pwhash_verify(&pw_hash, password.as_bytes()),
			_ => false,
		}
	}

	// pub async fn get_profile(&self) -> Result<Profile, AppError> {
	// 	let profile = Profile::get(&self.profile).await?;
	// 	Ok(profile)
	// }
}

impl From<&RegisterFormValues> for User {
	fn from(values: &RegisterFormValues) -> Self {
		Self {
			key: "".to_owned(),
			email_address: values.email_address.to_owned(),
			username: values.username.to_owned(),
			password: User::hash_pw(&values.password),
			link: Some(nanoid!(10, &nanoid::alphabet::SAFE)),
			profile: String::new(),
		}
	}
}

impl FromRequest for User {
	type Error = AppError;
	type Future = Pin<Box<dyn Future<Output = Result<Self, Self::Error>>>>;
	type Config = ();

	fn from_request(req: &HttpRequest, _payload: &mut dev::Payload) -> Self::Future {
		let key = jwt::decode_from_header(req);
		if key.is_err() {
			return Box::pin(async { Err(AppError::bad_request("invalid token")) });
		}
		let key = key.unwrap();
		Box::pin(async move {
			let user = User::get(&key).await;
			if user.is_err() {
				return Err(AppError::unauthorized("user not found"));
			}
			let user = user.unwrap();
			Ok(user)
		})
	}
}

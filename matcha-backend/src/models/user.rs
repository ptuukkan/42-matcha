use crate::database::api;
use crate::database::cursor::CursorRequest;
use crate::errors::AppError;
use nanoid::nanoid;
use serde::{Deserialize, Serialize};
use sodiumoxide::crypto::pwhash::argon2id13;
use std::env;

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
	#[serde(skip_serializing)]
	#[serde(rename = "_key")]
	pub key: String,
	pub first_name: String,
	pub last_name: String,
	pub email_address: String,
	pub username: String,
	password: String,
	pub link: Option<String>,
}

#[derive(Deserialize, Debug)]
struct CreateUserResponse {
	_id: String,
	_key: String,
	_rev: String,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct RegisterFormValues {
	first_name: String,
	last_name: String,
	email_address: String,
	username: String,
	password: String,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct LoginFormValues {
	pub email_address: String,
	pub password: String,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ResetFormValues {
	pub email_address: String,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ResetPasswordValues {
	pub password: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct LoginResponse {
	first_name: String,
	last_name: String,
	email_address: String,
	pub token: String,
}

impl User {
	pub fn new(
		first_name: &str,
		last_name: &str,
		email_address: &str,
		password: &str,
		username: &str,
	) -> User {
		User {
			key: String::new(),
			first_name: String::from(first_name),
			last_name: String::from(last_name),
			email_address: String::from(email_address),
			username: String::from(username),
			password: User::hash_pw(&String::from(password)),
			link: None,
		}
	}

	pub async fn change_password(&mut self, password: &str) -> Result<(), AppError> {
		self.password = User::hash_pw(password);
		self.link = None;
		self.update().await?;
		Ok(())
	}

	pub fn login_response(&self, token: &str) -> LoginResponse {
		LoginResponse {
			first_name: self.first_name.to_owned(),
			last_name: self.last_name.to_owned(),
			email_address: self.email_address.to_owned(),
			token: token.to_owned(),
		}
	}

	fn url() -> String {
		let db_url: String = env::var("DB_URL").expect("Missing env variable DB_URL");
		db_url + "_api/document/users/"
	}

	fn key_url(&self) -> String {
		let db_url: String = env::var("DB_URL").expect("Missing env variable DB_URL");
		format!("{}_api/document/users/{}", db_url, self.key)
	}

	pub async fn create(&self) -> Result<(), AppError> {
		api::post::<User, CreateUserResponse>(&User::url(), &self).await?;
		Ok(())
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
	pub async fn update(&self) -> Result<(), AppError> {
		api::patch(&self.key_url(), &self).await?;
		Ok(())
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

	pub async fn find(key: &str, value: &str) -> Result<Vec<Self>, AppError> {
		let query = format!("FOR u IN users filter u.{} == '{}' return u", key, value);
		let result = CursorRequest::from(query)
			.send()
			.await?
			.extract_all::<Self>()
			.await?;
		Ok(result)
	}
}

impl From<RegisterFormValues> for User {
	fn from(values: RegisterFormValues) -> Self {
		Self {
			key: "".to_owned(),
			email_address: values.email_address,
			username: values.username,
			first_name: values.first_name,
			last_name: values.last_name,
			password: User::hash_pw(&values.password),
			link: Some(nanoid!(10, &nanoid::alphabet::SAFE)),
		}
	}
}

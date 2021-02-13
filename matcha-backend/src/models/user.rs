
use crate::database::api;
use serde::{Deserialize, Serialize};
use std::env;
use crate::errors::{AppError};
use sodiumoxide::crypto::pwhash::argon2id13;
use nanoid::nanoid;

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
	#[serde(skip_serializing)]
	#[serde(rename = "_key")]
	key: String,
	pub first_name: String,
	pub last_name: String,
	pub email_address: String,
	pub user_name: String,
	password: String,
	pub link: String,
	pub token: Option<String>
}

#[derive(Deserialize, Debug)]
struct CreateUserResponse {
	_id: String,
	_key: String,
	_rev: String
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct RegisterFormValues {
	first_name: String,
	last_name: String,
	email_address: String,
	username: String,
	password: String
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct LoginFormValues {
	pub email_address: String,
	pub password: String
}

impl User {
	pub fn new(first_name: &str, last_name: &str,
				email_address: &str, password: &str, user_name: &str)
				-> User {
		User {
			key: String::new(),
			first_name: String::from(first_name),
			last_name: String::from(last_name),
			email_address: String::from(email_address),
			user_name: String::from(user_name),
			password: User::hash_pw(&String::from(password)),
			link: String::new(),
			token: None,
		}
	}

	fn url() -> String {
		let db_url: String = env::var("DB_URL")
			.expect("Missing env variable DB_URL");
		db_url + "_api/document/users/"
	}

	fn key_url(&self) -> String {
		let db_url: String = env::var("DB_URL")
			.expect("Missing env variable DB_URL");
		format!("{}_api/document/users/{}", db_url, self.key)
	}

	pub async fn create(&self) -> Result<(), AppError> {
		api::post::<User, CreateUserResponse>(&User::url(), &self)
			.await?;
		Ok(())
	}

	fn hash_pw(password: &String) -> String {
		sodiumoxide::init().unwrap();
    	let hash = argon2id13::pwhash(
       		password.as_bytes(),
        	argon2id13::OPSLIMIT_INTERACTIVE,
        	argon2id13::MEMLIMIT_INTERACTIVE,
    	).unwrap();
    	let texthash = std::str::from_utf8(&hash.0).unwrap().trim_end_matches('\u{0}').to_string();
 		texthash
	}
	pub async fn update(&self) -> Result<(), AppError> {
		api::patch(&self.key_url(), &self).await?;
		Ok(())
	}

	pub fn verify_pw(&self, password: &String) -> bool {
		sodiumoxide::init().unwrap();
		let mut padded = [0u8; 128];
		self.password
			.as_bytes()
			.iter()
			.enumerate()
			.for_each(|(i, val)| {
				padded[i] = val.clone();
		});
		match argon2id13::HashedPassword::from_slice(&padded) {
			Some(pw_hash) => argon2id13::pwhash_verify(&pw_hash, password.as_bytes()),
			_ => false,
		}
	}
}

impl From<RegisterFormValues> for User {
	fn from(values: RegisterFormValues) -> Self {
		Self {
			key: "".to_owned(),
			email_address: values.email_address,
			user_name: values.username,
			first_name: values.first_name,
			last_name: values.last_name,
			password: User::hash_pw(&values.password),
			link: nanoid!(10, &nanoid::alphabet::SAFE),
			token: None
		}
	}
}

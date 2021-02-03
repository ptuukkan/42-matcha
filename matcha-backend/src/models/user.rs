
use crate::database::api;
use serde::{Deserialize, Serialize};
use std::env;
use crate::errors::{AppError};
extern crate nanoid;
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
	pub link: String
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
			password: String::from(password),
			link: String::new()
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

	pub async fn update(&self) -> Result<(), AppError> {
		api::patch(&self.key_url(), &self).await?;
		Ok(())
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
			password: values.password,
			link: nanoid!(10, &nanoid::alphabet::SAFE)
		}
	}
}

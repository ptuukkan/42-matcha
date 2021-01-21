
use std::convert::TryFrom;
use crate::database::api;
use serde::{Deserialize, Serialize};
use std::env;
use crate::errors::{AppError, AppErrorType};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
	#[serde(skip_serializing)]
	#[serde(rename = "_key")]
	key: String,
	first_name: String,
	last_name: String,
	pub email_address: String,
	password: String
}

#[derive(Deserialize, Debug)]
struct CreateUserResponse {
	_id: String,
	_key: String,
	_rev: String
}

#[derive(Deserialize, Debug)]
pub struct RegisterFormValues {
	first_name: String,
	last_name: String,
	email_address: String,
	password: String
}

impl User {
	pub fn new(first_name: &str, last_name: &str,
				email_address: &str, password: &str)
				-> User {
		User {
			key: String::new(),
			first_name: String::from(first_name),
			last_name: String::from(last_name),
			email_address: String::from(email_address),
			password: String::from(password)
		}
	}

	fn url() -> String {
		let db_url: String = env::var("DB_URL")
			.expect("Missing env variable DB_URL");
		db_url + "_api/document/users/"
	}

	// fn is_valid(&self) -> bool {
	// 	if self.first_name.len() < 2 {
	// 		return false;
	// 	}
	// 	if self.last_name.len() < 2 {
	// 		return false;
	// 	}
	// 	if self.email_address.len() < 3 {
	// 		return false
	// 	}
	// 	if self.password.len() < 8 {
	// 		return false
	// 	}
	// 	true
	// }

	pub async fn create(&mut self) {
		let res = api::post::<User, CreateUserResponse>(&User::url(), &self)
			.await
			.expect("Failed");
		self.key = res._key;
	}

	// pub async fn delete(&self) {
	// 	let url = User::url() + &self.key;
	// 	let res = api::delete(&url)
	// 		.await
	// 		.expect("Failed");
	// 	println!("{:?}", res);
	// }

}

impl TryFrom<RegisterFormValues> for User {
	type Error = AppError;

	fn try_from(values: RegisterFormValues) -> Result<Self, Self::Error> {
		if values.first_name == "rikki" {
			return Err(AppError {
				error: AppErrorType::ValidationError("invalid field".to_owned())
			})
		}
		Ok(User::new(&values.first_name, &values.last_name, &values.email_address, &values.password))
	}
}


use serde::{Deserialize, Serialize};
use crate::errors::{AppError};
use crate::models::user::{LoginFormValues, User};
use crate::database::cursor::{CursorRequest};
use jsonwebtoken::{ encode, EncodingKey, Header };
use std::env;

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
	sub: String,
	exp: usize,
}

pub async fn login(values: LoginFormValues) -> Result<String, AppError> {
	let mut result = CursorRequest::from(format!("FOR u IN users filter u.email_address == '{}'return u", values.email_address))
		.send()
		.await?
		.extract_all::<User>()
		.await?;
	if let Some(user) = result.pop() {
		if user.link != "" {
			return Err(AppError::unauthorized("Please verify your account!"));
		}
		if !user.verify_pw(&values.password) {
			return Err(AppError::unauthorized("Login failed"));
		}

		let my_claims = Claims { sub: user.user_name.to_owned(), exp: 7200 };
		let key: String = env::var("SECRET")
			.expect("Missing env variable SECRET");
	
		let token = match encode(&Header::default(), &my_claims, &EncodingKey::from_secret(key.as_ref())){
			Ok(t) => t,
			Err(_) => panic!()
		};
		Ok(token)

	} else {
		return Err(AppError::unauthorized("Login failed"));
	}
}

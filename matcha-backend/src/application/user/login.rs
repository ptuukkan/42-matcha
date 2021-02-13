
use actix_web::HttpRequest;
use serde::{Deserialize, Serialize};
use crate::errors::{AppError};
use crate::models::user::{LoginFormValues, User, LoginResponse};
use crate::database::cursor::{CursorRequest};
use jsonwebtoken::{ encode, decode, EncodingKey, DecodingKey, Header, Validation };
use std::env;

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
	sub: String,
	exp: usize,
}


/* pub async fn current_user(req: HttpRequest) -> Result<User, AppError> {
	if let Some(auth) = req.headers().get("Authorization") {

	}

} */

pub async fn login(values: LoginFormValues) -> Result<LoginResponse, AppError> {
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
		let my_claims = Claims { sub: user.email_address.to_owned(), exp: 7200 };
		let key: String = env::var("SECRET")?;
		let token = encode(&Header::default(), &my_claims, &EncodingKey::from_secret(key.as_ref()))?;

		Ok(user.login_response(token))
	} else {
		return Err(AppError::unauthorized("Login failed"));
	}
}

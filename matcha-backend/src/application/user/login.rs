use crate::errors::AppError;
use crate::models::user::{LoginFormValues, LoginResponse, User};
use actix_web::HttpRequest;
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
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
	if let Some(user) = User::find("email_address", &values.email_address)
		.await?
		.pop()
	{
		if !user.verify_pw(&values.password) {
			return Err(AppError::unauthorized("Login failed"));
		}
		if !user.link.is_empty() {
			return Err(AppError::unauthorized("Please verify your account!"));
		}
		let my_claims = Claims {
			sub: user.email_address.to_owned(),
			exp: 7200,
		};
		let key: String = env::var("SECRET")?;
		let token = encode(
			&Header::default(),
			&my_claims,
			&EncodingKey::from_secret(key.as_ref()),
		)?;

		Ok(user.login_response(token))
	} else {
		return Err(AppError::unauthorized("Login failed"));
	}
}

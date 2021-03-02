use crate::errors::AppError;
use crate::models::user::{LoginFormValues, LoginResponse, User};
use actix_web::HttpRequest;
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
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

		let exp = iat + 10;
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

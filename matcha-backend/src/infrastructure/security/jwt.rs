use crate::errors::AppError;
use crate::models::user::User;
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

pub fn create_token(user: &User) -> Result<String, AppError> {
	let iat = SystemTime::now()
		.duration_since(SystemTime::UNIX_EPOCH)?
		.as_secs() as usize;
	let exp = iat + 390000;
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
	Ok(token)
}

pub fn decode_from_header(req: &HttpRequest) -> Result<String, AppError> {
	if let Some(auth) = req.headers().get("Authorization") {
		let key: String = env::var("SECRET")?;
		if let Some(encoded_token) = auth.to_str()?.strip_prefix("Bearer ") {
			let decoded_token = decode::<Claims>(
				&encoded_token,
				&DecodingKey::from_secret(key.as_ref()),
				&Validation::default(),
			)?;
			Ok(decoded_token.claims.sub)
		} else {
			Err(AppError::bad_request("Invalid token"))
		}
	} else {
		Err(AppError::bad_request("No authorization header"))
	}
}

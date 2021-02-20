use crate::errors::AppError;
use crate::models::user::{LoginFormValues, LoginResponse, User};
use actix_web::{HttpRequest};
use std::time::SystemTime;
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
	sub: String,
	//iat: usize,
	exp: usize,
}

pub async fn current_user(req: HttpRequest) -> Result<LoginResponse, AppError> {
	if let Some(auth) = req.headers().get("Authorization") {
		let key: String = env::var("SECRET")?;
		let token: &str = auth.to_str().unwrap().strip_prefix("Bearer ").unwrap();
		let token_data = decode::<Claims>(&token, &DecodingKey::from_secret(key.as_ref()), &Validation::default())?;
		let user = User::find("_key", &token_data.claims.sub).await?.pop().unwrap();
		println!("{:#?}", token_data);
		Ok(user.login_response(token_data.claims.sub))		
	} else {
		Err(AppError::bad_request("dojong"))
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
			.duration_since(SystemTime::UNIX_EPOCH)
			.unwrap()
			.as_secs() as usize;
		
		let exp =  iat + 86400;
		let my_claims = Claims {
			sub: user.key.to_owned(),
			exp: exp,
			//iat: iat
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

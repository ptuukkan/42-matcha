use crate::errors::AppError;
use crate::infrastructure::security::jwt;
use crate::models::user::{LoginFormValues, LoginResponse, User};
use actix_web::HttpRequest;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
	sub: String,
	iat: usize,
	exp: usize,
}

pub async fn current_user(req: HttpRequest) -> Result<LoginResponse, AppError> {
	let key = jwt::decode_from_header(req)?;
	if let Some(user) = User::find("_key", &key).await?.pop() {
		Ok(user.login_response(""))
	} else {
		Err(AppError::bad_request("User not found"))
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
		let token = jwt::create_token(&user)?;
		Ok(user.login_response(&token))
	} else {
		return Err(AppError::unauthorized("Login failed"));
	}
}

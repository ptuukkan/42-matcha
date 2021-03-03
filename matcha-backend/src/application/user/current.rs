use crate::errors::AppError;
use crate::infrastructure::security::jwt;
use crate::models::user::{LoginResponse, User};
use actix_web::HttpRequest;

pub async fn current_user(req: HttpRequest) -> Result<LoginResponse, AppError> {
	let key = jwt::decode_from_header(req)?;
	let user = User::get(&key).await?;
	Ok(user.login_response(""))
}

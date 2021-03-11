use crate::errors::AppError;
use crate::infrastructure::security::jwt;
use crate::models::interest::Interest;
use crate::models::user::User;
use actix_web::HttpRequest;

pub async fn get(req: HttpRequest) -> Result<Vec<Interest>, AppError> {
	let user_key = jwt::decode_from_header(req)?;
	User::get(&user_key).await?;
	let interests = Interest::get_all().await?;
	Ok(interests)
}


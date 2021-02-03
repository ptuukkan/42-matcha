use crate::database::cursor::CursorRequest;
use crate::errors::{AppError, LoginError};
use crate::models::user::User;

pub async fn verify(link: &str) -> Result<(), AppError> {
	let result = CursorRequest::from(format!(
		"FOR u IN users filter u.link == '{}' return u",
		link
	))
	.send()
	.await?
	.extract_all::<User>()
	.await?;
	if result.is_empty() {
		return Err(AppError::LoginError(LoginError::new("Verification failed"))); // Create a new error Verification error instead
	}
	if !result.is_empty() {
		// Remove link from users table
		
		//( CursorRequest::from(format!("UPDATE {} WITH {{link: null}} IN users", result[0])).send().await?;
	}
	Ok(())
}

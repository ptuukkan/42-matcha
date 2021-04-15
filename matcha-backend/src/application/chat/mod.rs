use crate::errors::AppError;
use crate::models::chat::Chat;
use crate::models::chat_connection::ChatConnection;
use crate::models::user::User;

pub mod client;
pub mod server;

pub async fn create(profile_a: &str, profile_b: &str) -> Result<(), AppError> {
	let mut chat = Chat::new();
	chat.create().await?;
	let cc_a = ChatConnection::new(profile_a, &chat.key);
	let cc_b = ChatConnection::new(profile_b, &chat.key);
	cc_a.create().await?;
	cc_b.create().await?;
	Ok(())
}

pub async fn get_all(user: User) -> Result<Vec<Chat>, AppError> {
	let chats = Chat::find_outbound(&user.profile).await?;
	Ok(chats)
}

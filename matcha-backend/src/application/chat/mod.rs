use crate::application::notification;
use crate::chat::client::WsChatMessage;
use crate::chat::server::WsServer;
use crate::errors::AppError;
use crate::models::chat::Chat;
use crate::models::chat::ChatDto;
use crate::models::chat::Message;
use crate::models::chat_connection::ChatConnection;
use crate::models::notification::NotificationType;
use crate::models::user::User;
use actix::Addr;

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

pub async fn get_all(user: User) -> Result<Vec<ChatDto>, AppError> {
	let chats = Chat::find_outbound(&user.profile).await?;
	let mut chat_dtos: Vec<ChatDto> = vec![];
	for mut chat in chats {
		if let Some(chat_connection) = ChatConnection::find(&user.profile, &chat.key).await? {
			if let Some(participant) = Chat::get_participants(&chat.key)
				.await?
				.into_iter()
				.find(|x| x.id != user.profile)
			{
				chat.messages.sort_by_key(|x| x.timestamp);
				chat_dtos.push(ChatDto {
					participant,
					messages: chat.messages,
					chat_id: chat.key,
					unread: chat_connection.unread,
				});
			}
		}
	}
	Ok(chat_dtos)
}

pub async fn message(message: WsChatMessage, ws_srv: Addr<WsServer>) -> Result<(), AppError> {
	if let Some(mut chat_connection) = ChatConnection::find(&message.to, &message.chat_id).await?
	{
		let mut chat = Chat::get(&message.chat_id).await?;
		chat.messages.push(Message::from(message.to_owned()));
		chat.update().await?;
		chat_connection.unread = true;
		chat_connection.update().await?;
		notification::create(
			NotificationType::Message,
			&message.to,
			&message.from,
			ws_srv,
		)
		.await?;
		Ok(())
	} else {
		Ok(())
	}
}

pub async fn delete(profile_a: &str, profile_b: &str) -> Result<(), AppError> {
	let chats = Chat::find_outbound(profile_a).await?;
	for chat in chats {
		if let Some(participant) = Chat::get_participants(&chat.key)
			.await?
			.into_iter()
			.find(|x| x.id != profile_a)
		{
			if participant.id == *profile_b {
				chat.delete().await?;
				return Ok(());
			}
		}
	}
	Ok(())
}

pub async fn read(user: User, chat_id: String) -> Result<(), AppError> {
	if let Some(mut chat_connection) = ChatConnection::find(&user.profile, &chat_id).await? {
		chat_connection.unread = false;
		chat_connection.update().await?;
		Ok(())
	} else {
		Err(AppError::bad_request("invalid data"))
	}
}

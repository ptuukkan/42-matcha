use crate::errors::AppError;
use crate::models::chat::Chat;
use crate::models::chat::ChatDto;
use crate::models::chat_connection::ChatConnection;
use crate::models::profile::Profile;
use crate::models::profile::ProfileThumbnail;
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

pub async fn get_all(user: User) -> Result<Vec<ChatDto>, AppError> {
	let chats = Chat::find_outbound(&user.profile).await?;
	let my_profile = Profile::get(&user.profile).await?;
	let mut chat_dtos: Vec<ChatDto> = vec![];
	for chat in chats {
		let images = Chat::get_participants(&chat.key).await?;
		let mut image: Vec<ProfileThumbnail> = images
			.into_iter()
			.filter(|x| x.id != my_profile.key)
			.collect();
		
		//println!("{:#?}", chat.messages);
		let tempc_dto = ChatDto::new(image.pop().unwrap(), chat.messages);
		chat_dtos.push(tempc_dto);
	}
	Ok(chat_dtos)
}

use crate::models::block::Block;
use crate::chat::server::WsServer;
use crate::errors::AppError;
use crate::models::notification::{
	Notification, NotificationDto, NotificationSlice, NotificationType,
};
use crate::models::profile::{ProfileSlice, ProfileThumbnail};
use crate::models::user::User;
use actix::Addr;
use std::cmp::Reverse;
use std::convert::TryFrom;

pub async fn get_all(user: User) -> Result<Vec<NotificationDto>, AppError> {
	let mut notifications = Notification::get_profile_notifications(&user.profile).await?;
	notifications.sort_by_key(|x| Reverse(x.timestamp));
	let mut notification_dtos = Vec::<NotificationDto>::new();
	for notification in notifications {
		notification_dtos.push(load_notification_dto(notification).await?);
	}
	Ok(notification_dtos)
}

pub async fn create(
	notification_type: NotificationType,
	target_profile: &str,
	source_profile: &str,
	ws_srv: Addr<WsServer>,
) -> Result<(), AppError> {
	if Block::find(target_profile, source_profile).await?.is_some() {
		return Ok(());
	}
	let mut notification = Notification::new(notification_type, target_profile, source_profile);
	notification.create().await?;
	let notification_dto = load_notification_dto(notification).await?;
	ws_srv.do_send(notification_dto);
	Ok(())
}

pub async fn read(notifications: Vec<String>) -> Result<(), AppError> {
	let notification_slices: Vec<NotificationSlice> = notifications
		.into_iter()
		.map(NotificationSlice::from)
		.collect();
	Notification::update_many(notification_slices).await?;
	Ok(())
}

pub async fn clear(notifications: Vec<String>) -> Result<(), AppError> {
	Notification::delete_many(notifications).await?;
	Ok(())
}

pub async fn load_notification_dto(
	notification: Notification,
) -> Result<NotificationDto, AppError> {
	if let Some(profile_slice) = ProfileSlice::get(&notification.source_profile).await? {
		let profile_thumbnail = ProfileThumbnail::try_from(&profile_slice)?;
		let mut notification_dto = NotificationDto::from(notification);
		notification_dto.source_profile = Some(profile_thumbnail);
		Ok(notification_dto)
	} else {
		Err(AppError::internal("No profile found for notification"))
	}
}

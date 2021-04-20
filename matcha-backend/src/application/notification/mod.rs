use crate::errors::AppError;
use crate::models::notification::{
	Notification, NotificationDto, NotificationSlice, NotificationType,
};
use crate::models::profile::{ProfileSlice, ProfileThumbnail};
use crate::models::user::User;
use std::cmp::Reverse;
use std::convert::TryFrom;

pub async fn get_all(user: User) -> Result<Vec<NotificationDto>, AppError> {
	let mut notifications = Notification::get_profile_notifications(&user.profile).await?;
	notifications.sort_by_key(|x| Reverse(x.timestamp));
	let mut notification_dtos = Vec::<NotificationDto>::new();
	for notification in notifications {
		if let Some(profile_slice) = ProfileSlice::get(&notification.source_profile).await? {
			let profile_thumbnail = ProfileThumbnail::try_from(&profile_slice)?;
			let mut notification_dto = NotificationDto::from(notification);
			notification_dto.profile = Some(profile_thumbnail);
			notification_dtos.push(notification_dto);
		}
	}
	Ok(notification_dtos)
}

pub async fn create(
	notification_type: NotificationType,
	target_profile: &str,
	source_profile: &str,
) -> Result<(), AppError> {
	let mut notification = Notification::new(notification_type, target_profile, source_profile);
	notification.create().await?;
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

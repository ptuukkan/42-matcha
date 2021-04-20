use crate::database::api;
use crate::database::cursor::CursorRequest;
use crate::errors::AppError;
use crate::models::base::CreateResponse;
use crate::models::profile::ProfileThumbnail;
use chrono::Utc;
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Notification {
	#[serde(skip_serializing)]
	#[serde(rename = "_key")]
	pub key: String,
	pub notification_type: NotificationType,
	pub timestamp: i64,
	pub target_profile: String,
	pub source_profile: String,
	pub read: bool,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub enum NotificationType {
	Like,
	Visit,
	Message,
	LikeBack,
	Unlike,
}

impl Notification {
	pub fn new(
		notification_type: NotificationType,
		target_profile: &str,
		source_profile: &str,
	) -> Self {
		Self {
			key: String::new(),
			notification_type,
			timestamp: Utc::now().timestamp_millis(),
			target_profile: target_profile.to_owned(),
			source_profile: source_profile.to_owned(),
			read: false,
		}
	}

	fn url() -> Result<String, AppError> {
		let db_url: String = env::var("DB_URL")?;
		Ok(db_url + "_api/document/notifications/")
	}

	pub async fn create(&mut self) -> Result<(), AppError> {
		let res = api::post::<Self, CreateResponse>(&Self::url()?, &self).await?;
		self.key = res.key;
		Ok(())
	}

	pub async fn update_many(notifications: Vec<NotificationSlice>) -> Result<(), AppError> {
		api::patch(&Self::url()?, &notifications).await?;
		Ok(())
	}

	pub async fn delete_many(notifications: Vec<String>) -> Result<(), AppError> {
		api::delete_many(&Self::url()?, &notifications).await?;
		Ok(())
	}

	pub async fn get_profile_notifications(profile_key: &str) -> Result<Vec<Self>, AppError> {
		let query = format!(
			"FOR n IN notifications FILTER n.targetProfile == '{}' RETURN n",
			profile_key
		);
		let notifications = CursorRequest::from(query)
			.send()
			.await?
			.extract_all::<Self>()
			.await?;
		Ok(notifications)
	}
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct NotificationDto {
	pub id: String,
	pub timestamp: i64,
	pub profile: Option<ProfileThumbnail>,
	pub message: String,
	pub read: bool,
}

impl From<Notification> for NotificationDto {
	fn from(notification: Notification) -> Self {
		let message = match notification.notification_type {
			NotificationType::Like => "liked you".to_owned(),
			NotificationType::LikeBack => "liked you back".to_owned(),
			NotificationType::Message => "messaged you".to_owned(),
			NotificationType::Unlike => {
				"unliked you. You are no longer matched and cannot chat with them".to_owned()
			}
			NotificationType::Visit => "checked you out".to_owned(),
		};
		NotificationDto {
			id: notification.key,
			timestamp: notification.timestamp,
			message,
			read: notification.read,
			profile: None,
		}
	}
}

#[derive(Serialize, Deserialize, Debug)]
pub struct NotificationSlice {
	#[serde(rename = "_key")]
	pub key: String,
	pub read: bool,
}

impl From<String> for NotificationSlice {
	fn from(id: String) -> Self {
		Self {
			key: id,
			read: true,
		}
	}
}

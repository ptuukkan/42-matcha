use crate::application::chat;
use crate::application::notification;
use crate::chat::server::WsServer;
use crate::errors::AppError;
use crate::models::block::Block;
use crate::models::image::ImageDto;
use crate::models::like::Like;
use crate::models::location::{Location, LocationDto};
use crate::models::notification::NotificationType;
use crate::models::profile::{
	PrivateProfileDto, Profile, ProfileFormValues, ProfileWithDistance, PublicProfileDto,
};
use crate::models::report::{Report, ReportFormValues};
use crate::models::user::User;
use crate::models::visit::Visit;
use actix::Addr;
use serde_json::{json, Value};
use std::convert::TryFrom;

pub mod image;
pub mod interest;
pub mod location;
pub mod utils;

pub async fn get_my(user: &User) -> Result<PrivateProfileDto, AppError> {
	let profile = Profile::get(&user.profile).await?;
	let images: Vec<ImageDto> = profile
		.get_images()
		.await?
		.iter()
		.filter_map(|x| ImageDto::try_from(x).ok())
		.collect();
	let visits = Visit::find_inbound(&profile.key).await?;
	let location = Location::get(&profile.location).await?;
	let likes = Like::find_inbound(&profile.key).await?;
	let fame = utils::fame_rating(&profile.key).await?;
	let mut profile_dto = PrivateProfileDto::from(profile);
	profile_dto.location = LocationDto::from(location);
	profile_dto.images = images;
	profile_dto.visits = visits;
	profile_dto.likes = likes;
	profile_dto.fame_rating = fame;

	Ok(profile_dto)
}

pub async fn update(user: &User, mut values: ProfileFormValues) -> Result<(), AppError> {
	values.validate().await?;
	let profile = Profile::get(&user.profile).await?;
	if let Some(location) = values.location {
		let mut profile_location = Location::get(&profile.location).await?;
		profile_location.coordinate = vec![location.latitude, location.longitude];
		profile_location.update().await?;
	}
	values.location = None;
	if let Some(interests) = values.interests {
		values.interests = interest::create(interests).await?;
	}
	profile.update_from_form(&values).await?;
	Ok(())
}

pub async fn get(
	user: &User,
	profile_key: &str,
	ws_srv: Addr<WsServer>,
) -> Result<PublicProfileDto, AppError> {
	let my_profile = Profile::get(&user.profile).await?;
	if !my_profile.is_complete() {
		return Err(AppError::unauthorized("unauthorized"));
	}
	let their_profile = ProfileWithDistance::get(&user.profile, profile_key).await?;
	if !their_profile.profile.is_complete() {
		return Err(AppError::not_found("Profile not found"));
	}
	if user.profile != their_profile.profile.key {
		utils::visit(&user.profile, profile_key, ws_srv).await?;
	}
	let profile_dto = utils::load_profile_dto(&my_profile, their_profile).await?;
	Ok(profile_dto)
}

pub async fn block_profile(user: &User, their_profile_key: &str) -> Result<(), AppError> {
	let my_profile = Profile::get(&user.profile).await?;
	if !my_profile.is_complete() {
		return Err(AppError::unauthorized("unauthorized"));
	}
	if Block::find(&user.profile, their_profile_key)
		.await?
		.is_some()
	{
		Ok(())
	} else {
		let block = Block::new(&user.profile, their_profile_key);
		block.create().await?;
		Ok(())
	}
}

pub async fn unblock_profile(user: &User, their_profile_key: &str) -> Result<(), AppError> {
	let my_profile = Profile::get(&user.profile).await?;
	if !my_profile.is_complete() {
		return Err(AppError::unauthorized("unauthorized"));
	}
	if let Some(block) = Block::find(&user.profile, their_profile_key).await? {
		block.delete().await?;
		Ok(())
	} else {
		Ok(())
	}
}

pub async fn report_profile(
	user: &User,
	their_profile_key: &str,
	reason: ReportFormValues,
) -> Result<(), AppError> {
	reason.validate()?;
	let my_profile = Profile::get(&user.profile).await?;
	if !my_profile.is_complete() {
		return Err(AppError::unauthorized("unauthorized"));
	}
	if Report::find(&user.profile, their_profile_key)
		.await?
		.is_some()
	{
		Ok(())
	} else {
		let report = Report::new(&user.profile, their_profile_key, reason);
		report.create().await?;
		Ok(())
	}
}

pub async fn like(
	user: &User,
	profile_key: &str,
	ws_srv: Addr<WsServer>,
) -> Result<Value, AppError> {
	let my_profile = Profile::get(&user.profile).await?;
	if !my_profile.is_complete() {
		return Err(AppError::unauthorized("unauthorized"));
	}
	if Like::find(&user.profile, profile_key).await?.is_some() {
		Err(AppError::bad_request("Already liked this profile"))
	} else {
		let like = Like::new(&user.profile, profile_key);
		like.create().await?;
		let res: Value;
		if Like::find(profile_key, &user.profile).await?.is_some() {
			res = json!({"connected": true});
			chat::create(profile_key, &user.profile).await?;
			notification::create(
				NotificationType::LikeBack,
				profile_key,
				&user.profile,
				ws_srv,
			)
			.await?;
		} else {
			res = json!({"connected": false});
			notification::create(NotificationType::Like, profile_key, &user.profile, ws_srv)
				.await?;
		}
		Ok(res)
	}
}

pub async fn unlike(
	user: &User,
	profile_key: &str,
	ws_srv: Addr<WsServer>,
) -> Result<(), AppError> {
	let my_profile = Profile::get(&user.profile).await?;
	if !my_profile.is_complete() {
		return Err(AppError::unauthorized("unauthorized"));
	}
	if let Some(like) = Like::find(&user.profile, profile_key).await? {
		if Like::find(profile_key, &user.profile).await?.is_some() {
			chat::delete(&user.profile, profile_key).await?;
			notification::create(NotificationType::Unlike, profile_key, &user.profile, ws_srv)
				.await?;
		}
		like.delete().await?;
		Ok(())
	} else {
		Ok(())
	}
}

use crate::errors::AppError;
use crate::models::block::Block;
use crate::models::image::{Image, ImageDto};
use crate::models::like::Like;
use crate::models::profile::{Profile, ProfileWithDistance, PublicProfileDto};
use crate::models::visit::Visit;
use std::convert::TryFrom;

pub async fn visit(from: &str, to: &str) -> Result<(), AppError> {
	if Visit::find(from, to).await?.is_some() {
		Ok(())
	} else {
		let visit = Visit::new(from, to);
		visit.create().await?;
		Ok(())
	}
}

pub async fn fame_rating(profile_key: &str) -> Result<usize, AppError> {
	let total_likes = Like::count().await?;
	let total_visits = Visit::count().await?;
	let total_profiles = Profile::count().await?;
	let profile_visits = Visit::find_inbound(profile_key).await?.len();
	let profile_likes = Like::find_inbound(profile_key).await?.len();
	let avg = (total_likes + total_visits) as f32 / total_profiles as f32;
	let mut fame: f32;
	if profile_visits + profile_likes == 0 {
		fame = 0.0;
	} else {
		fame = (profile_likes + profile_visits) as f32 / avg * 5.0;
		if fame > 10.0 {
			fame = 10.0;
		}
	}
	Ok(fame as usize)
}

pub async fn load_profile_dto(
	my_profile: &Profile,
	their_profile: ProfileWithDistance,
) -> Result<PublicProfileDto, AppError> {
	let images: Vec<ImageDto> = Image::get_profile_images(&their_profile.profile.key)
		.await?
		.iter()
		.filter_map(|x| ImageDto::try_from(x).ok())
		.collect();
	let key = their_profile.profile.key.to_owned();
	let mut profile_dto = PublicProfileDto::try_from(their_profile.profile)?;
	profile_dto.images = images;
	profile_dto.distance = their_profile.distance;
	profile_dto.liked = Like::find(&my_profile.key, &key).await?.is_some();
	if profile_dto.liked && Like::find(&key, &my_profile.key).await?.is_some() {
		profile_dto.connected = true;
	}
	profile_dto.fame_rating = fame_rating(&key).await?;
	for i in &my_profile.interests {
		if profile_dto.interests.contains(i) {
			profile_dto.mutual_interests += 1;
		}
	}
	profile_dto.compatibility_rating = compatibility_rating(my_profile, &profile_dto)?;
	profile_dto.blocked = Block::find(&my_profile.key, &key).await?.is_some();
	Ok(profile_dto)
}

fn compatibility_rating(
	my_profile: &Profile,
	their_profile: &PublicProfileDto,
) -> Result<u8, AppError> {
	let mut rating: i32 = 60;

	let age_diff = my_profile.age()? as i32 - their_profile.age as i32;
	if age_diff.abs() > 9 {
		rating -= age_diff.abs() * 2;
	} else if age_diff.abs() > 2 {
		rating -= age_diff.abs();
	}
	if their_profile.distance > 50 {
		rating -= their_profile.distance / 5;
	} else if their_profile.distance > 10 {
		rating -= their_profile.distance / 10;
	}
	rating -= 10 - their_profile.fame_rating as i32;
	rating += their_profile.mutual_interests * 5;
	if rating < 0 {
		Ok(0)
	} else if rating > 100 {
		Ok(100)
	} else {
		Ok(rating as u8)
	}
}

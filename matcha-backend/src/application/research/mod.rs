use crate::application::profile;
use crate::errors::AppError;
use crate::models::profile::{Profile, ProfileWithDistance, PublicProfileDto};
use crate::models::user::User;

pub async fn list(user: &User) -> Result<Vec<PublicProfileDto>, AppError> {
	let my_profile = Profile::get(&user.profile).await?;
	let profiles: Vec<ProfileWithDistance> = ProfileWithDistance::get_all(&my_profile.key)
		.await?
		.into_iter()
		.collect();
	let mut profile_dtos: Vec<PublicProfileDto> = vec![];
	for p in profiles {
		let pdto = profile::load_profile_dto(user, p).await?;
		profile_dtos.push(pdto);
	}
	Ok(profile_dtos)
}

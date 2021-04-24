use crate::application::profile;
use crate::errors::AppError;
use crate::models::profile::{Profile, ProfileWithDistance, PublicProfileDto};
use crate::models::user::User;
use serde::{Deserialize};
use std::convert::TryFrom;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ResearchFormValues {
	age: Vec<u8>,
	fame_rating: Vec<usize>,
	distance: Vec<i32>,
	interests: Vec<String>,
}

struct ResearchParams {
	age: (u8, u8),
	fame_rating: (usize, usize),
	distance: (i32, i32),
	interests: Vec<String>,
}

impl TryFrom<ResearchFormValues> for ResearchParams {
	type Error = AppError;

	fn try_from(values: ResearchFormValues) -> Result<Self, Self::Error> {
		if values.age.len() != 2 || values.fame_rating.len() != 2 || values.distance.len() != 2 {
			return Err(AppError::bad_request("Bad search params for research"));
		}
		Ok(Self {
			age: (*values.age.get(0).unwrap(), *values.age.get(1).unwrap()),
			fame_rating: (
				*values.fame_rating.get(0).unwrap(),
				*values.fame_rating.get(1).unwrap(),
			),
			distance: (
				*values.distance.get(0).unwrap(),
				*values.distance.get(1).unwrap(),
			),
			interests: values.interests,
		})
	}
}

pub async fn list(user: &User, params: ResearchFormValues) -> Result<Vec<PublicProfileDto>, AppError> {
	let my_profile = Profile::get(&user.profile).await?;
	let profiles: Vec<ProfileWithDistance> = ProfileWithDistance::get_all(&my_profile.key).await?;
	let mut profile_dtos: Vec<PublicProfileDto> = vec![];
	for p in profiles {
		let pdto = profile::utils::load_profile_dto(&my_profile, p).await?;
		profile_dtos.push(pdto);
	}
	let params = ResearchParams::try_from(params)?;
	let profile_dtos = profile_dtos
		.into_iter()
		.filter(|x| filter_profile(user, &x, &params))
		.collect();
	Ok(profile_dtos)
}

fn filter_profile(user: &User, profile_dto: &PublicProfileDto, params: &ResearchParams) -> bool {
	filter_age(profile_dto, params)
		&& filter_fame_rating(profile_dto, params)
		&& filter_distance(profile_dto, params)
		&& filter_interests(profile_dto, params)
		&& profile_dto.id != user.profile
		&& !profile_dto.blocked
}

fn filter_age(profile_dto: &PublicProfileDto, params: &ResearchParams) -> bool {
	profile_dto.age >= params.age.0 && profile_dto.age <= params.age.1
}

fn filter_fame_rating(profile_dto: &PublicProfileDto, params: &ResearchParams) -> bool {
	profile_dto.fame_rating >= params.fame_rating.0
		&& profile_dto.fame_rating <= params.fame_rating.1
}

fn filter_distance(profile_dto: &PublicProfileDto, params: &ResearchParams) -> bool {
	profile_dto.distance >= params.distance.0 && profile_dto.distance <= params.distance.1
}

fn filter_interests(profile_dto: &PublicProfileDto, params: &ResearchParams) -> bool {
	if params.interests.is_empty() {
		return true;
	}
	for params_interest in &params.interests {
		if profile_dto.interests.contains(params_interest) {
			return true;
		}
	}
	false
}

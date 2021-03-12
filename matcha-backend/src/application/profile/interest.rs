use crate::errors::AppError;
use crate::infrastructure::security::jwt;
use crate::models::interest::{Interest, InterestDto};
use crate::models::user::User;
use actix_web::HttpRequest;

pub async fn get(req: HttpRequest) -> Result<Vec<InterestDto>, AppError> {
	let user_key = jwt::decode_from_header(req)?;
	User::get(&user_key).await?;
	let interests = Interest::get_all().await?;
	let interest_dtos: Vec<InterestDto> = interests
		.into_iter()
		.map(InterestDto::from)
		.collect();
	Ok(interest_dtos)
}

pub async fn create(interests: Vec<String>) -> Result<Option<Vec<String>>, AppError> {
	let known_interests = Interest::get_many(interests.to_owned()).await?;
	let interests_to_create: Vec<Interest> = interests
		.iter()
		.zip(known_interests.iter())
		.filter_map(|x| {
			if x.1.is_none() {
				Some(Interest::from(x.0))
			} else {
				None
			}
		})
		.collect();
	let mut created_keys = Interest::create_many(interests_to_create).await?;
	let mut existing_keys: Vec<String> = known_interests
		.into_iter()
		.filter_map(|x| if let Some(a) = x { Some(a.key) } else { None })
		.collect();
	existing_keys.append(&mut created_keys);
	Ok(Some(existing_keys))
}

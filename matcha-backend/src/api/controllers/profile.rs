use crate::application::profile;
use crate::models::profile::ProfileFormValues;
use crate::models::user::User;
use actix_web::web::{Json, Path};
use actix_web::{delete, get, post, put, web, HttpResponse};
use actix_web::{error::Error, HttpRequest};

#[get("/profile")]
async fn get_my_profile(req: HttpRequest) -> Result<HttpResponse, Error> {
	let profile = profile::get_my(req).await?;
	Ok(HttpResponse::Ok().json(profile))
}

#[put("/profile")]
async fn update_profile(
	req: HttpRequest,
	values: Json<ProfileFormValues>,
) -> Result<HttpResponse, Error> {
	profile::update(req, values.into_inner()).await?;
	Ok(HttpResponse::Ok().finish())
}

#[post("/profile/image")]
async fn create_image(req: HttpRequest, parts: awmp::Parts) -> Result<HttpResponse, Error> {
	let image = profile::image::create(req, parts).await?;
	Ok(HttpResponse::Created().json(image))
}

#[delete("/profile/image/{id}")]
async fn delete_image(req: HttpRequest, Path(id): Path<String>) -> Result<HttpResponse, Error> {
	profile::image::delete(req, &id).await?;
	Ok(HttpResponse::Ok().finish())
}

#[put("/profile/image/{id}")]
async fn set_main(req: HttpRequest, Path(id): Path<String>) -> Result<HttpResponse, Error> {
	profile::image::set_main(req, &id).await?;
	Ok(HttpResponse::Ok().finish())
}

#[get("/interests")]
async fn get_interests(_user: User) -> Result<HttpResponse, Error> {
	let interests = profile::interest::get().await?;
	Ok(HttpResponse::Ok().json(interests))
}

#[get("/profile/{id}")]
async fn get_profile(user: User, Path(id): Path<String>) -> Result<HttpResponse, Error> {
	let profile = profile::get(user, &id).await?;
	Ok(HttpResponse::Ok().json(profile))
}

pub fn routes(config: &mut web::ServiceConfig) {
	config
		.service(get_my_profile)
		.service(get_profile)
		.service(update_profile)
		.service(create_image)
		.service(set_main)
		.service(delete_image)
		.service(get_interests);
}

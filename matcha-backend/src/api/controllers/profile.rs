use crate::application::profile;
use crate::models::profile::ProfileFormValues;
use actix_web::web::{Json, Path};
use actix_web::{delete, get, post, put, web, HttpResponse};
use actix_web::{error::Error, HttpRequest};

#[get("/profile")]
async fn get_my_profile(req: HttpRequest) -> Result<HttpResponse, Error> {
	let profile = profile::get_my(req).await?;
	Ok(HttpResponse::Ok().json(profile))
}

#[put("/profile")]
async fn edit_profile(
	req: HttpRequest,
	values: Json<ProfileFormValues>,
) -> Result<HttpResponse, Error> {
	profile::edit(req, values.into_inner()).await?;
	Ok(HttpResponse::Created().finish())
}

#[post("/profile/image")]
async fn create_image(req: HttpRequest, parts: awmp::Parts) -> Result<HttpResponse, Error> {
	println!("here");
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

pub fn routes(config: &mut web::ServiceConfig) {
	config
		.service(get_my_profile)
		.service(edit_profile)
		.service(create_image)
		.service(delete_image);
}

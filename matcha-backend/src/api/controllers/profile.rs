use crate::application::profile;
use crate::models::profile::ProfileFormValues;
use actix_web::web::{Json, Path};
use actix_web::{delete, post, put, web, HttpResponse};
use actix_web::{error::Error, HttpRequest};

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
	profile::image::create(req, parts).await?;
	Ok(HttpResponse::Created().finish())
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
		.service(edit_profile)
		.service(create_image)
		.service(delete_image);
}

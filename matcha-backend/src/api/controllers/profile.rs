use crate::application::profile;
use crate::models::profile::ProfileFormValues;
use actix_web::web::Json;
use actix_web::{error::Error, HttpRequest};
use actix_web::{post, web, HttpResponse};

#[post("/profile")]
async fn create_profile(
	req: HttpRequest,
	values: Json<ProfileFormValues>,
) -> Result<HttpResponse, Error> {
	profile::create::create(req, values.into_inner()).await?;
	Ok(HttpResponse::Created().finish())
}

pub fn routes(config: &mut web::ServiceConfig) {
	config.service(create_profile);
}

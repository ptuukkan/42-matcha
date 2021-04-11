use actix_web::web::Json;
use crate::application::research::ResearchFormValues;
use crate::application::research;
use crate::models::user::User;
use actix_web::error::Error;
use actix_web::{post, web, HttpResponse};

#[post("/research/list")]
async fn list(user: User, params: Json<ResearchFormValues>) -> Result<HttpResponse, Error> {
	let profiles = research::list(&user, params.into_inner()).await?;
	Ok(HttpResponse::Ok().json(profiles))
}

pub fn routes(config: &mut web::ServiceConfig) {
	config.service(list);
}

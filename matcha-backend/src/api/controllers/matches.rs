use crate::application::matches;
use crate::models::user::User;
use actix_web::error::Error;
use actix_web::{get, web, HttpResponse};

#[get("/matches")]
async fn list(user: User) -> Result<HttpResponse, Error> {
	let profiles = matches::list(&user).await?;
	Ok(HttpResponse::Ok().json(profiles))
}

pub fn routes(config: &mut web::ServiceConfig) {
	config.service(list);
}

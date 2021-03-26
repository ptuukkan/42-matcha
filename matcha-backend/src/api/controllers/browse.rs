use crate::models::user::User;
use crate::application::browse;
use actix_web::{get, web, HttpResponse};
use actix_web::{error::Error};


#[get("/browse/list")]
async fn list(user: User) -> Result<HttpResponse, Error> {
	let profiles = browse::list(&user).await?;
	Ok(HttpResponse::Ok().json(profiles))
}

pub fn routes(config: &mut web::ServiceConfig) {
	config
		.service(list);
}

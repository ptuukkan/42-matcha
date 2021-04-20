use crate::application::notification;
use crate::models::user::User;
use actix_web::error::Error;
use actix_web::web::Json;
use actix_web::{get, post, web, HttpResponse};

#[get("/notification")]
async fn get_notifications(user: User) -> Result<HttpResponse, Error> {
	let notifications = notification::get_all(user).await?;
	Ok(HttpResponse::Ok().json(notifications))
}

#[post("/notification")]
async fn read_notifications(
	_user: User,
	notifications: Json<Vec<String>>,
) -> Result<HttpResponse, Error> {
	notification::read(notifications.into_inner()).await?;
	Ok(HttpResponse::Ok().finish())
}

#[post("/notification/clear")]
async fn clear_notifications(
	_user: User,
	notifications: Json<Vec<String>>,
) -> Result<HttpResponse, Error> {
	notification::clear(notifications.into_inner()).await?;
	Ok(HttpResponse::Ok().finish())
}

pub fn routes(config: &mut web::ServiceConfig) {
	config
		.service(get_notifications)
		.service(read_notifications)
		.service(clear_notifications);
}

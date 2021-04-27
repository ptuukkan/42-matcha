use crate::application::profile;
use crate::chat::server::WsServer;
use crate::models::profile::ProfileFormValues;
use crate::models::report::ReportFormValues;
use crate::models::user::User;
use actix::Addr;
use actix_web::error::Error;
use actix_web::web::{Json, Path};
use actix_web::{delete, get, post, put, web, HttpResponse};

#[get("/api/profile")]
async fn get_my_profile(user: User) -> Result<HttpResponse, Error> {
	let profile = profile::get_my(&user).await?;
	Ok(HttpResponse::Ok().json(profile))
}

#[get("/api/profile/{id}")]
async fn get_profile(
	user: User,
	Path(id): Path<String>,
	ws_srv: web::Data<Addr<WsServer>>,
) -> Result<HttpResponse, Error> {
	let profile = profile::get(&user, &id, ws_srv.get_ref().clone()).await?;
	Ok(HttpResponse::Ok().json(profile))
}

#[get("/api/profile/{id}/block")]
async fn block_profile(user: User, Path(id): Path<String>) -> Result<HttpResponse, Error> {
	profile::block_profile(&user, &id).await?;
	Ok(HttpResponse::Ok().finish())
}

#[delete("/api/profile/{id}/block")]
async fn unblock_profile(user: User, Path(id): Path<String>) -> Result<HttpResponse, Error> {
	profile::unblock_profile(&user, &id).await?;
	Ok(HttpResponse::Ok().finish())
}

#[post("/api/profile/{id}/report")]
async fn report_profile(
	user: User,
	Path(id): Path<String>,
	reason: Json<ReportFormValues>,
) -> Result<HttpResponse, Error> {
	profile::report_profile(&user, &id, reason.into_inner()).await?;
	Ok(HttpResponse::Ok().finish())
}

#[get("/api/profile/{id}/like")]
async fn like_profile(
	user: User,
	Path(id): Path<String>,
	ws_srv: web::Data<Addr<WsServer>>,
) -> Result<HttpResponse, Error> {
	let res = profile::like(&user, &id, ws_srv.get_ref().clone()).await?;
	Ok(HttpResponse::Ok().json(&res))
}

#[delete("/api/profile/{id}/like")]
async fn unlike_profile(
	user: User,
	Path(id): Path<String>,
	ws_srv: web::Data<Addr<WsServer>>,
) -> Result<HttpResponse, Error> {
	profile::unlike(&user, &id, ws_srv.get_ref().clone()).await?;
	Ok(HttpResponse::Ok().finish())
}

#[put("/api/profile")]
async fn update_profile(
	user: User,
	values: Json<ProfileFormValues>,
) -> Result<HttpResponse, Error> {
	profile::update(&user, values.into_inner()).await?;
	Ok(HttpResponse::Ok().finish())
}

#[post("/api/profile/image")]
async fn create_image(user: User, parts: awmp::Parts) -> Result<HttpResponse, Error> {
	let image = profile::image::create(user, parts).await?;
	Ok(HttpResponse::Created().json(image))
}

#[delete("/api/profile/image/{id}")]
async fn delete_image(user: User, Path(id): Path<String>) -> Result<HttpResponse, Error> {
	profile::image::delete(user, &id).await?;
	Ok(HttpResponse::Ok().finish())
}

#[put("/api/profile/image/{id}")]
async fn set_main(user: User, Path(id): Path<String>) -> Result<HttpResponse, Error> {
	profile::image::set_main(user, &id).await?;
	Ok(HttpResponse::Ok().finish())
}

#[get("/api/interests")]
async fn get_interests(_user: User) -> Result<HttpResponse, Error> {
	let interests = profile::interest::get().await?;
	Ok(HttpResponse::Ok().json(interests))
}

pub fn routes(config: &mut web::ServiceConfig) {
	config
		.service(get_my_profile)
		.service(get_profile)
		.service(block_profile)
		.service(unblock_profile)
		.service(report_profile)
		.service(like_profile)
		.service(unlike_profile)
		.service(update_profile)
		.service(create_image)
		.service(set_main)
		.service(delete_image)
		.service(get_interests);
}

mod application;
mod database;
mod errors;
mod models;
mod infrastructure;
#[cfg(test)]
mod tests;

use actix_cors::Cors;
use actix_web::middleware::Logger;
use actix_web::web::Json;
use actix_web::{error::Error, HttpRequest};
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use database::seed_data;
use dotenv::dotenv;
use log::info;

#[get("/")]
async fn hello() -> impl Responder {
	info!("hello!");
	HttpResponse::Ok().body("Hello world!")
}

#[get("/seed")]
async fn seed() -> impl Responder {
	seed_data::seed_data().await;
	HttpResponse::Ok().body("Success")
}

#[post("/user/login")]
async fn login(values: Json<models::user::LoginFormValues>) -> Result<HttpResponse, Error> {
	let user = application::user::login::login(values.into_inner()).await?;
	Ok(HttpResponse::Ok().json(user))
}

#[post("/user/register")]
async fn register(values: Json<models::user::RegisterFormValues>) -> Result<HttpResponse, Error> {
	application::user::register::register(values.into_inner()).await?;
	Ok(HttpResponse::Created().finish())
}

#[post("/user/password/reset")]
async fn reset(values: Json<models::user::ResetFormValues>) -> Result<HttpResponse, Error> {
	application::user::password::reset(values.into_inner()).await?;
	Ok(HttpResponse::Created().finish())
}

#[post("/user/password/reset/{reset_link}")]
async fn reset_password(
	web::Path(link): web::Path<String>,
	values: Json<models::user::ResetPasswordValues>,
) -> Result<HttpResponse, Error> {
	application::user::password::reset_password(&link, values.into_inner()).await?;
	Ok(HttpResponse::Created().finish())
}

#[get("/user/verify/{link}")] // <- define path parameters
async fn verify(web::Path(link): web::Path<String>) -> Result<HttpResponse, Error> {
	application::user::register::verify(&link).await?;
	Ok(HttpResponse::Ok().finish())
}

#[get("/user/current")]
async fn current_user(req: HttpRequest) -> Result<HttpResponse, Error> {
	let user = application::user::current::current_user(req).await?;
	Ok(HttpResponse::Ok().json(user))
}

#[post("/profile")]
async fn create_profile(
	req: HttpRequest,
	values: Json<models::profile::ProfileFormValues>,
) -> Result<HttpResponse, Error> {
	application::profile::create::create(req, values.into_inner()).await?;
	Ok(HttpResponse::Created().finish())
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
	dotenv().ok();
	env_logger::init();
	database::setup::arango_setup().await;
	let server = HttpServer::new(|| {
		App::new()
			.wrap(Logger::new("%a \"%r\" %s"))
			.wrap(Cors::permissive())
			.service(hello)
			.service(seed)
			.service(register)
			.service(login)
			.service(verify)
			.service(reset_password)
			.service(reset)
			.service(current_user)
	})
	.bind("127.0.0.1:8080")?;
	info!("Starting server");
	server.run().await
}

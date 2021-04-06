mod application;
mod database;
mod errors;
mod models;
mod infrastructure;
mod api;
#[cfg(test)]
mod tests;

use actix_web::Error;
use actix_cors::Cors;
use actix_web::middleware::Logger;
use actix_web::{get, App, HttpResponse, HttpServer, Responder};
use database::seed_data;
use dotenv::dotenv;
use log::info;
use actix_files::Files;
use std::fs;

#[get("/")]
async fn hello() -> impl Responder {
	info!("hello!");
	HttpResponse::Ok().body("Hello world!")
}

#[get("/seed")]
async fn seed() -> Result<HttpResponse, Error> {
	seed_data::seed_data().await?;
	Ok(HttpResponse::Ok().body("Success"))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
	dotenv().ok();
	env_logger::init();
	database::setup::arango_setup().await.expect("DB setup failed");
	fs::create_dir_all("images")?;
	let server = HttpServer::new(|| {
		App::new()
			.wrap(Logger::new("%a \"%r\" %s"))
			.wrap(Cors::permissive())
			.service(seed)
			.service(Files::new("/img", "./images").show_files_listing())
			.configure(api::controllers::user::routes)
			.configure(api::controllers::profile::routes)
			.configure(api::controllers::browse::routes)
			.configure(api::controllers::research::routes)
	})
	.bind("127.0.0.1:8080")?;
	info!("Starting server");
	server.run().await
}

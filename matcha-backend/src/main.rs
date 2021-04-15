mod api;
mod application;
mod database;
mod errors;
mod infrastructure;
mod models;
#[cfg(test)]
mod tests;

use actix::Actor;
use actix_cors::Cors;
use actix_files::Files;
use actix_web::middleware::Logger;
use actix_web::Error;
use actix_web::{get, App, HttpResponse, HttpServer, Responder};
use application::chat;
use database::seed_data;
use dotenv::dotenv;
use log::info;
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
	database::setup::arango_setup()
		.await
		.expect("DB setup failed");
	// App state

	// Start chat server actor
	let server = chat::server::ChatServer::new().start();

	fs::create_dir_all("images")?;
	let server = HttpServer::new(move || {
		App::new()
			.data(server.clone())
			.wrap(Logger::new("%a \"%r\" %s"))
			.wrap(Cors::permissive())
			.service(seed)
			.service(Files::new("/img", "./images").show_files_listing())
			.configure(api::controllers::user::routes)
			.configure(api::controllers::profile::routes)
			.configure(api::controllers::browse::routes)
			.configure(api::controllers::research::routes)
			.configure(api::controllers::chat::routes)
			.configure(api::controllers::matches::routes)
	})
	.bind("127.0.0.1:8080")?;
	info!("Starting server");
	server.run().await
}

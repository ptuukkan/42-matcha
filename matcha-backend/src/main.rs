mod database;
mod models;
mod application;
mod errors;

use actix_web::error::Error;
use actix_web::web::Json;
use dotenv::dotenv;
use actix_web::{web, get, post, App, HttpResponse, HttpServer, Responder};
use actix_cors::Cors;
use database::seed_data;


#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[get("/seed")]
async fn seed() -> impl Responder {
    seed_data::seed_data().await;
    HttpResponse::Ok().body("Success")
}

#[post("/user/login")]
async fn login(values: Json<models::user::LoginFormValues>) -> Result<HttpResponse, Error> {
    let token = application::user::login::login(values.into_inner()).await?;
    Ok(HttpResponse::Ok().json(token))
}

#[post("/user/register")]
async fn register(values: Json<models::user::RegisterFormValues>) -> Result<HttpResponse, Error> {
    application::user::register::register(values.into_inner()).await?;
    Ok(HttpResponse::Created().finish())
}

#[get("/verify/{link}")] // <- define path parameters
async fn verify(web::Path(link): web::Path<String>) -> Result<HttpResponse, Error> {
    application::user::register::verify(&link).await?;
    Ok(HttpResponse::Ok().finish())
}




#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
   database::setup::arango_setup().await;
    HttpServer::new(|| {
        App::new()
            .wrap(Cors::permissive())
            .service(hello)
            .service(seed)
            .service(register)
            .service(login)
            .service(verify)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}

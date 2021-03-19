use actix_web::HttpRequest;
use crate::models::user::User;
use crate::models::user::RegisterFormValues;
use crate::models::user::CredentialChangeValues;
use actix_web_validator::Json;
use crate::application::user;
use crate::models::user::{
	LoginFormValues, ResetFormValues, ResetPasswordValues,
};
use actix_web::{error::Error};
use actix_web::{get, post, web, HttpResponse};

#[post("/user/login")]
async fn login(values: Json<LoginFormValues>) -> Result<HttpResponse, Error> {
	let user = user::login::login(values.into_inner()).await?;
	Ok(HttpResponse::Ok().json(user))
}

#[post("/user/register")]
async fn register(values: Json<RegisterFormValues>) -> Result<HttpResponse, Error> {
	user::register::register(values.into_inner()).await?;
	Ok(HttpResponse::Created().finish())
}

#[post("/user/credentials")]
async fn credentials(req: HttpRequest, values: Json<CredentialChangeValues>) -> Result<HttpResponse, Error> {
	user::credentials::change(req, values.into_inner()).await?; 
	Ok(HttpResponse::Created().finish())
}

#[post("/user/password/reset")]
async fn reset(values: Json<ResetFormValues>) -> Result<HttpResponse, Error> {
	user::password::reset(values.into_inner()).await?;
	Ok(HttpResponse::Created().finish())
}

#[post("/user/password/reset/{reset_link}")]
async fn reset_password(
	web::Path(link): web::Path<String>,
	values: Json<ResetPasswordValues>,
) -> Result<HttpResponse, Error> {
	user::password::reset_password(&link, values.into_inner()).await?;
	Ok(HttpResponse::Created().finish())
}

#[get("/user/verify/{link}")] // <- define path parameters
async fn verify(web::Path(link): web::Path<String>) -> Result<HttpResponse, Error> {
	user::register::verify(&link).await?;
	Ok(HttpResponse::Ok().finish())
}

#[get("/user/current")]
async fn current_user(user: User) -> Result<HttpResponse, Error> {
	Ok(HttpResponse::Ok().json(user.login_response("").await?))
}

pub fn routes(config: &mut web::ServiceConfig) {
	config
		.service(login)
		.service(register)
		.service(reset)
		.service(reset_password)
		.service(verify)
		.service(credentials)
		.service(current_user);
}

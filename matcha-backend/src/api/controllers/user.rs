use crate::application::profile::location;
use crate::application::user;
use crate::application::user::password::{ResetFormValues, ResetPasswordValues};
use crate::models::location::LocationDto;
use crate::models::user::LoginFormValues;
use crate::models::user::{RegisterFormValues, User};
use actix_web::error::Error;
use actix_web::{get, post, web, web::Json, web::Path, HttpResponse};

#[post("/user/login")]
async fn login(values: Json<LoginFormValues>) -> Result<HttpResponse, Error> {
	let user = user::login(values.into_inner()).await?;
	Ok(HttpResponse::Ok().json(user))
}

#[post("/user/register")]
async fn register(values: Json<RegisterFormValues>) -> Result<HttpResponse, Error> {
	user::register::register(values.into_inner()).await?;
	Ok(HttpResponse::Created().finish())
}

#[post("/user/credentials")]
async fn credentials(
	user: User,
	values: Json<user::CredentialChangeValues>,
) -> Result<HttpResponse, Error> {
	user::change_credentials(user, values.into_inner()).await?;
	Ok(HttpResponse::Ok().finish())
}

#[post("/user/password/reset")]
async fn reset(values: Json<ResetFormValues>) -> Result<HttpResponse, Error> {
	user::password::reset(values.into_inner()).await?;
	Ok(HttpResponse::Ok().finish())
}

#[post("/user/password/reset/{reset_link}")]
async fn reset_password(
	Path(link): Path<String>,
	values: Json<ResetPasswordValues>,
) -> Result<HttpResponse, Error> {
	user::password::reset_password(&link, values.into_inner()).await?;
	Ok(HttpResponse::Ok().finish())
}

#[get("/user/verify/{link}")]
async fn verify(Path(link): Path<String>) -> Result<HttpResponse, Error> {
	user::register::verify(&link).await?;
	Ok(HttpResponse::Ok().finish())
}

#[post("/user/current")]
async fn current_user(user: User, location: Json<LocationDto>) -> Result<HttpResponse, Error> {
	location::update(&user, location.into_inner()).await?;
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

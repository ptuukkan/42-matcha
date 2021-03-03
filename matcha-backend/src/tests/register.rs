use super::*;
use init::init;
use actix_web::{
	http::StatusCode,
	test::{self, TestRequest},
	App,
};
use crate::api::controllers::user::{register, login};

#[actix_rt::test]
async fn valid() {
	init().await;
	let mut app = test::init_service(App::new().service(register)).await;
	let body = test_models::User::valid();
	let resp = TestRequest::post()
		.uri("/user/register")
		.set_json(&body)
		.send_request(&mut app)
		.await;
	assert_eq!(
		resp.status(),
		StatusCode::CREATED,
		"Failed to register user"
	);
}

#[actix_rt::test]
async fn duplicate_email() {
	init().await;
	let mut app = test::init_service(App::new().service(register).service(login)).await;
	let body = test_models::User::dup_email();
	let resp = TestRequest::post()
		.uri("/user/register")
		.set_json(&body)
		.send_request(&mut app)
		.await;
	assert_eq!(
		resp.status(),
		StatusCode::BAD_REQUEST,
		"Should not be able to register user with duplicate email"
	);
}

#[actix_rt::test]
async fn duplicate_username() {
	init().await;
	let mut app = test::init_service(App::new().service(register).service(login)).await;
	let body = test_models::User::dup_username();
	let resp = TestRequest::post()
		.uri("/user/register")
		.set_json(&body)
		.send_request(&mut app)
		.await;
	assert_eq!(
		resp.status(),
		StatusCode::BAD_REQUEST,
		"Should not be able to register user with duplicate username"
	);
}

#[actix_rt::test]
async fn duplicate_username_and_email() {
	init().await;
	let mut app = test::init_service(App::new().service(register).service(login)).await;
	let body = test_models::User::dup_user_email();
	let resp = TestRequest::post()
		.uri("/user/register")
		.set_json(&body)
		.send_request(&mut app)
		.await;
	assert_eq!(
		resp.status(),
		StatusCode::BAD_REQUEST,
		"Should not be able to register user with duplicate username and duplicate email"
	);
}

#[actix_rt::test]
async fn empty() {
	init().await;
	let mut app = test::init_service(App::new().service(register).service(login)).await;
	let body = test_models::User::empty();
	let resp = TestRequest::post()
		.uri("/user/register")
		.set_json(&body)
		.send_request(&mut app)
		.await;
	assert_eq!(
		resp.status(),
		StatusCode::BAD_REQUEST,
		"Should not be able to register with empty values"
	);
}

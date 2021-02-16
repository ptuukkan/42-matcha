use super::*;
use crate::*;
use init::init;
use actix_web::{
	http::StatusCode,
	test::{self, TestRequest},
	App,
};

#[actix_rt::test]
async fn valid() {
	init().await;
	let mut app = test::init_service(App::new().service(login)).await;
	let body = test_models::LoginValues::valid();
	let resp = TestRequest::post()
		.uri("/user/login")
		.set_json(&body)
		.send_request(&mut app)
		.await;
	assert_eq!(
		resp.status(),
		StatusCode::OK,
		"Login with correct password fails"
	);
}

#[actix_rt::test]
async fn invalid_password() {
	init().await;
	let mut app = test::init_service(App::new().service(login)).await;
	let body = test_models::LoginValues::invalid_password();
	let resp = TestRequest::post()
		.uri("/user/login")
		.set_json(&body)
		.send_request(&mut app)
		.await;
	assert_eq!(
		resp.status(),
		StatusCode::UNAUTHORIZED,
		"Login with incorrect password does not fail"
	);
}

#[actix_rt::test]
async fn invalid_email() {
	init().await;
	let mut app = test::init_service(App::new().service(login)).await;
	let body = test_models::LoginValues::invalid_email();
	let resp = TestRequest::post()
		.uri("/user/login")
		.set_json(&body)
		.send_request(&mut app)
		.await;
	assert_eq!(
		resp.status(),
		StatusCode::UNAUTHORIZED,
		"Login with incorrect email does not fail"
	);
}

#[actix_rt::test]
async fn invalid_email_password() {
	init().await;
	let mut app = test::init_service(App::new().service(login)).await;
	let body = test_models::LoginValues::invalid_password_email();
	let resp = TestRequest::post()
		.uri("/user/login")
		.set_json(&body)
		.send_request(&mut app)
		.await;
	assert_eq!(
		resp.status(),
		StatusCode::UNAUTHORIZED,
		"Login with incorrect email and password does not fail"
	);
}

#[actix_rt::test]
async fn empty() {
	init().await;
	let mut app = test::init_service(App::new().service(login)).await;
	let body = test_models::LoginValues::empty();
	let resp = TestRequest::post()
		.uri("/user/login")
		.set_json(&body)
		.send_request(&mut app)
		.await;
	assert_eq!(
		resp.status(),
		StatusCode::UNAUTHORIZED,
		"Login with empty values does not fail"
	);
}

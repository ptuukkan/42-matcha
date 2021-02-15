use super::*;
use crate::*;
use init::init;
use actix_web::{
	http::StatusCode,
	test::{self, TestRequest},
	App,
};
use serde_json::json;

#[actix_rt::test]
async fn correct() {
	init().await;
	let mut app = test::init_service(App::new().service(login)).await;
	let body = json!({
		"emailAddress": "bob.matthews@email.com",
		"password": "Password123!"
	});
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
async fn incorrect_password() {
	init().await;
	let mut app = test::init_service(App::new().service(login)).await;
	let body = json!({
		"emailAddress": "bob.matthews@email.com",
		"password": "Paaaaaaaa"
	});
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
async fn incorrect_email() {
	init().await;
	let mut app = test::init_service(App::new().service(login)).await;
	let body = json!({
		"emailAddress": "bob.mataaathews@email.com",
		"password": "Password123!"
	});
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
async fn incorrect_both() {
	init().await;
	let mut app = test::init_service(App::new().service(login)).await;
	let body = json!({
		"emailAddress": "bob.matathews@email.com",
		"password": "Passaword123!"
	});
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

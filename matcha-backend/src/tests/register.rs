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
	let mut app = test::init_service(App::new().service(register)).await;
	let body = json!({
		"firstName": "Teppo",
		"lastName": "Testaaja",
		"username": "Tepe",
		"emailAddress": "tepe@localhost",
		"password": "Password123!"
	});
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
	let body = json!({
		"firstName": "Teppo",
		"lastName": "Testaaja",
		"username": "Tepe2",
		"emailAddress": "bob.matthews@email.com",
		"password": "Password123!"
	});
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
	let body = json!({
		"firstName": "Teppo",
		"lastName": "Testaaja",
		"username": "bob",
		"emailAddress": "tepe2@localhost",
		"password": "Password123!"
	});
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

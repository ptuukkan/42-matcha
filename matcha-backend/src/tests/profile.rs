use crate::models::profile::Profile;
use super::*;
use init::init;
use actix_web::{
	http::StatusCode,
	test::{self, TestRequest},
	App,
};
use crate::api::controllers;
use crate::models::user::User;

#[actix_rt::test]
async fn profile_exists_after_register() {
	init().await;
	let mut app = test::init_service(App::new().service(controllers::user::register)).await;
	let mut body = test_models::User::valid();
	body.username = "ProfileTest".to_owned();
	body.email_address = "profile@localhost.com".to_owned();
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
	let result = User::find("emailAddress", "profile@localhost.com").await;
	assert!(result.is_ok(), "Could not search for user");
	let mut users = result.unwrap();
	let maybe_user = users.pop();
	assert!(maybe_user.is_some(), "User not found");
	let user = maybe_user.unwrap();
	assert!(Profile::get(&user.key).await.is_ok(), "Could not find profile");
}

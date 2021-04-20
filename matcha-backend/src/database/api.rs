use crate::errors::AppError;
use actix_web::client::Client;
use serde::{de, Deserialize, Serialize};
use std::collections::HashMap;
use std::env;

#[derive(Deserialize)]
struct Jwt {
	#[serde(rename = "jwt")]
	token: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ArangoEdgeResponse {
	pub error: bool,
}

#[allow(dead_code)]
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct ArangoResponseError {
	code: Option<i32>,
	error: bool,
	error_message: String,
	error_num: i32,
}

#[derive(Deserialize)]
#[serde(untagged)]
enum ArangoResponse<T> {
	Success(T),
	Error(ArangoResponseError),
}

#[derive(Deserialize)]
pub struct ArangoCollectionCount {
	pub count: usize,
}

pub async fn get_arango_jwt() -> Result<String, AppError> {
	let jwt: String;

	match env::var("DB_JWT") {
		Ok(val) => jwt = val,
		Err(_e) => jwt = arango_login().await?,
	};
	env::set_var("DB_JWT", &jwt);
	Ok(jwt)
}

async fn arango_login() -> Result<String, AppError> {
	let db_base_url: String = env::var("DB_BASE_URL")?;
	let mut map = HashMap::new();
	map.insert("username", env::var("DB_USER")?);
	map.insert("password", env::var("DB_PASSWORD")?);
	let url = db_base_url.to_owned() + "_open/auth";

	let client = Client::default();
	let response = client
		.post(&url)
		.send_json(&map)
		.await?
		.json::<Jwt>()
		.await?;
	Ok(response.token)
}

pub async fn post<I: Serialize, O: de::DeserializeOwned>(
	url: &str,
	data: &I,
) -> Result<O, AppError> {
	let jwt = get_arango_jwt().await?;
	let client = Client::default();
	let response = client
		.post(url)
		.set_header("Authorization", "bearer ".to_owned() + &jwt)
		.send_json(data)
		.await?
		.json::<O>()
		.await?;
	Ok(response)
}

pub async fn get<O: de::DeserializeOwned>(url: &str) -> Result<O, AppError> {
	let jwt = get_arango_jwt().await?;
	let client = Client::default();
	let res = client
		.get(url)
		.set_header("Authorization", "bearer ".to_owned() + &jwt)
		.send()
		.await?
		.json::<ArangoResponse<O>>()
		.await?;
	match res {
		ArangoResponse::Success(x) => Ok(x),
		ArangoResponse::Error(e) => match e.code {
			Some(404) => Err(AppError::not_found(&e.error_message)),
			_ => Err(AppError::internal(&e.error_message)),
		},
	}
}

pub async fn patch<I: Serialize>(url: &str, data: &I) -> Result<(), AppError> {
	let jwt = get_arango_jwt().await?;
	let client = Client::default();
	client
		.patch(url)
		.set_header("Authorization", "bearer ".to_owned() + &jwt)
		.send_json(data)
		.await?;
	Ok(())
}

pub async fn delete(url: &str) -> Result<(), AppError> {
	let jwt = get_arango_jwt().await?;
	let client = Client::default();
	client
		.delete(url)
		.set_header("Authorization", "bearer ".to_owned() + &jwt)
		.send()
		.await?;
	Ok(())
}

pub async fn delete_many<I: Serialize>(url: &str, data: &I) -> Result<(), AppError> {
	let jwt = get_arango_jwt().await?;
	let client = Client::default();
	client
		.delete(url)
		.set_header("Authorization", "bearer ".to_owned() + &jwt)
		.send_json(data)
		.await?;
	Ok(())
}

pub async fn put<I: Serialize, O: de::DeserializeOwned>(
	url: &str,
	data: &I,
) -> Result<Vec<Option<O>>, AppError> {
	let jwt = get_arango_jwt().await?;
	let client = Client::default();
	let response = client
		.put(url)
		.set_header("Authorization", "bearer ".to_owned() + &jwt)
		.send_json(data)
		.await?
		.json::<Vec<ArangoResponse<O>>>()
		.await?;
	let result: Vec<Option<O>> = response
		.into_iter()
		.map(|x| match x {
			ArangoResponse::Success(a) => Some(a),
			ArangoResponse::Error(_) => None,
		})
		.collect();
	Ok(result)
}

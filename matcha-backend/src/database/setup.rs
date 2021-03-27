use super::api;
use crate::errors::AppError;
use serde::Deserialize;
use serde_json::json;
use std::env;

#[derive(Deserialize, Debug)]
struct DbList {
	error: bool,
	code: i32,
	result: Vec<String>,
}

#[derive(Deserialize)]
struct ArangoResponse {
	error: bool,
}

pub async fn arango_setup() -> Result<(), AppError> {
	let db_base_url: String = env::var("DB_BASE_URL")?;
	let db_url: String = env::var("DB_URL")?;
	let db_name: String = env::var("DB_NAME")?;
	let db_list = get_arango_dbs(&db_base_url).await?;

	if db_list.contains(&db_name) {
		return Ok(());
	}
	create_arango_db(&db_name, &db_base_url).await?;
	create_relations_graph(&db_url).await?;
	create_arango_collection("users", "2", &db_url).await?;
	create_arango_collection("images", "2", &db_url).await?;
	create_arango_collection("interests", "2", &db_url).await?;
	create_arango_collection("locations", "2", &db_url).await?;
	create_geoindex(&db_url).await?;
	Ok(())
}

async fn get_arango_dbs(db_base_url: &str) -> Result<Vec<String>, AppError> {
	let url = db_base_url.to_owned() + "_api/database";
	let res = api::get::<DbList>(&url).await?;
	if res.error {
		return Err(AppError::internal("Getting DB List failed"));
	}
	Ok(res.result)
}

async fn create_geoindex(db_base_url: &str) -> Result<(), AppError> {
	let url = db_base_url.to_owned() + "_api/index?collection=locations";
	let body = json!({
		"type" : "geo", 
		"fields" : [ 
		  "coordinate" 
		]
	});
	let res: ArangoResponse = api::post(&url, &body).await?;
	if res.error {
		return Err(AppError::internal("Locations collection creation failed"));
	}
	Ok(())
}

async fn create_arango_db(db_name: &str, db_base_url: &str) -> Result<(), AppError> {
	let url = db_base_url.to_owned() + "_api/database";
	let body = json!({ "name": db_name });

	let res: ArangoResponse = api::post(&url, &body).await?;
	if res.error {
		return Err(AppError::internal("DB creation failed"));
	}
	Ok(())
}

async fn create_arango_collection(cname: &str, ctype: &str, db_url: &str) -> Result<(), AppError> {
	let url = db_url.to_owned() + "_api/collection";
	let body = json!({
		"name": cname,
		"type": ctype,
	});

	let res: ArangoResponse = api::post(&url, &body).await?;

	if res.error {
		return Err(AppError::internal(&format!(
			"Failed to create collection: {}",
			cname
		)));
	}
	Ok(())
}

async fn create_relations_graph(db_url: &str) -> Result<(), AppError> {
	let url = format!("{}_api/gharial", db_url);
	let body = json!({
		"name": "relations",
		"edgeDefinitions": [
			{
				"collection": "visits",
				"from": ["profiles"],
				"to": ["profiles"]
			},
			{
				"collection": "likes",
				"from": ["profiles"],
				"to": ["profiles"]
			}
		]
	});

	let res: ArangoResponse = api::post(&url, &body).await?;

	if res.error {
		return Err(AppError::internal("Failed to create graph"));
	}

	Ok(())
}

pub async fn reset_db() -> Result<(), AppError> {
	let url = env::var("DB_BASE_URL")? + "_api/database/matcha";
	api::delete(&url).await?;
	Ok(())
}

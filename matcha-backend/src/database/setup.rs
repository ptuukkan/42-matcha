use actix_web::Error;
use std::env;
use std::collections::HashMap;
use serde::{Deserialize};
use super::api;

#[derive(Deserialize, Debug)]
struct DbList {
	error: bool,
	code: i32,
	result: Vec<String>
}

#[derive(Deserialize)]
struct ArangoDbCreateResponse {
	result: bool
}

#[derive(Deserialize, Debug)]
struct ArangoCollectionCreateResponse {
	error: bool,
	code: i32,
	r#type: i8
}


pub async fn arango_setup() {
	let db_base_url: String = env::var("DB_BASE_URL")
		.expect("Missing env variable DB_BASE_URL");
	let db_url: String = env::var("DB_URL")
		.expect("Missing env variable DB_URL");
	let db_name: String = env::var("DB_NAME")
		.expect("Missing env variable DB_NAME");
	let db_list: DbList = get_arango_dbs(&db_base_url)
		.await
		.expect("Getting DB List failed");

	if !db_list.result.contains(&db_name) {
		let db_result = create_arango_db(&db_name, &db_base_url)
			.await
			.expect("Database creation failed");
		if db_result.result != true {
			panic!("Database creation failed");
		}
		create_arango_collection("users", "2", &db_url)
			.await
			.expect("Collection creation failed");
	}

}

async fn get_arango_dbs(db_base_url: &String) -> Result<DbList, Error> {
	let url = db_base_url.to_owned() + "_api/database";
	let res = api::get::<DbList>(&url).await?;
	Ok(res)
}

async fn create_arango_db(db_name: &String, db_base_url: &String)
						-> Result<ArangoDbCreateResponse, Error> {
	let url = db_base_url.to_owned() + "_api/database";
	let mut map = HashMap::new();
	map.insert("name", db_name);

	let res = api::post::<HashMap<&str, &std::string::String>, ArangoDbCreateResponse>(&url, &map).await?;
	Ok(res)
}

async fn create_arango_collection(collection_name: &str, collection_type: &str, db_url: &String)
								-> Result<ArangoCollectionCreateResponse, Error> {
	let url = db_url.to_owned() + "_api/collection";
	let mut map = HashMap::new();
	let name = collection_name.to_owned();
	let r#type = collection_type.to_owned();
	map.insert("name", &name);
	map.insert("type", &r#type);

	let res = api::post::<HashMap<&str, &std::string::String>, ArangoCollectionCreateResponse>(&url, &map).await?;
	Ok(res)
}

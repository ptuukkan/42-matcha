use actix_web::Error;
use std::collections::HashMap;
use std::env;
use serde::{Deserialize, Serialize, de};
use actix_web::client::Client;


#[derive(Deserialize)]
struct Jwt {
	#[serde(rename = "jwt")]
	token: String
}

pub async fn get_arango_jwt() -> Result<String, Error> {
	let jwt: String;

	match env::var("DB_JWT") {
		Ok(val) => jwt = val,
		Err(_e) => jwt = arango_login()
			.await?
	};
	env::set_var("DB_JWT", &jwt);
	Ok(jwt)
}

async fn arango_login() -> Result<String, Error> {
	let db_base_url: String = env::var("DB_BASE_URL")
		.expect("Missing env variable DB_BASE_URL");
    let mut map = HashMap::new();
    map.insert("username", env::var("DB_USER").expect("DB_USER must be set"));
	map.insert("password", env::var("DB_PASSWORD").expect("DB_PASSWORD must be set"));
	let url = db_base_url.to_owned() + "_open/auth";

    let client = Client::default();
    let response = client.post(&url)
		.send_json(&map)
		.await?
		.json::<Jwt>()
		.await?;
    Ok(response.token)
}

pub async fn post<I: Serialize, O: de::DeserializeOwned>
					(url: &str, data: &I) -> Result<O, Error> {
	let jwt = get_arango_jwt().await.expect("DB Login failed");
	let client = Client::default();
	let response = client.post(url)
		.set_header("Authorization", "bearer ".to_owned() + &jwt)
		.send_json(data)
		.await?
		.json::<O>()
		.await?;
	Ok(response)

}

pub async fn get<O: de::DeserializeOwned>(url: &str)
					-> Result<O, Error> {
	let jwt = get_arango_jwt().await.expect("DB Login failed");
	let client = Client::default();
	let res = client.get(url)
		.set_header("Authorization", "bearer ".to_owned() + &jwt)
		.send()
		.await?
		.json::<O>()
		.await?;
	Ok(res)
}

pub async fn patch<I: Serialize>(url: &str, data: &I) -> Result<(), Error> {
	let jwt = get_arango_jwt().await.expect("DB Login failed");
	let client = Client::default();
	client.patch(url)
		.set_header("Authorization", "bearer ".to_owned() + &jwt)
		.send_json(data)
		.await?;
	Ok(())
}

use crate::*;
use async_mutex::Mutex;
use lazy_static::lazy_static;
use std::env;
use std::sync::Arc;

lazy_static! {
	static ref INITIATED: Arc<Mutex<bool>> = Arc::new(Mutex::new(false));
}

#[cfg(test)]
pub async fn init() {
	let mut initiated = INITIATED.lock().await;
	if !*initiated {
		dotenv().ok();
		env::set_var("DB_NAME", "matcha_test");
		env::set_var("DB_URL", "http://localhost:8529/_db/matcha_test/");
		database::api::delete("http://localhost:8529/_api/database/matcha_test")
			.await
			.expect("Failed to delete test db");
		database::setup::arango_setup().await;
		let bob = models::user::User::new(
			"bob.matthews@email.com",
			"Password123!",
			"bob",
		);
		bob.create().await.expect("Seed failed");

		*initiated = true;
	}
}

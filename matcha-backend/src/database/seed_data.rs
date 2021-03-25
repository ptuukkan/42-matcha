use serde_json::Value;
use crate::models::base::CreateResponse;
use crate::application::{profile, profile::visit, profile::like};
use crate::application::user;
use crate::database::api;
use crate::database::setup;
use crate::errors::AppError;
use crate::models::profile::Profile;
use crate::models::profile::ProfileFormValues;
use crate::models::user::RegisterFormValues;
use crate::models::user::User;
use serde_json::json;
use std::env;

pub async fn seed_data() -> Result<(), AppError> {

	setup::reset_db().await?;
	setup::arango_setup().await?;

	let jake_user = create_user("Jake", "Peralta", "jake@test.com").await?;
	let profile = update_profile(
		&jake_user,
		"Male",
		"Female",
		"Ultimate detective / genius",
		vec!["die-hard".to_owned()],
	)
	.await?;
	let profile = create_image(profile, "jake1").await?;
	let profile = create_image(profile, "jake2").await?;
	let jake = create_image(profile, "jake3").await?;

	let rosa_user = create_user("Rosa", "Diaz", "rosa@test.com").await?;
	let profile = update_profile(
		&rosa_user,
		"Female",
		"Male",
		"This is dumb",
		vec!["motorcycles".to_owned()],
	)
	.await?;
	let profile = create_image(profile, "rosa1").await?;
	let profile = create_image(profile, "rosa2").await?;
	let rosa = create_image(profile, "rosa3").await?;

	let terry_user = create_user("Terry", "Jeffords", "terry@test.com").await?;
	let profile = update_profile(
		&terry_user,
		"Male",
		"Female",
		"I like yogurt and gym",
		vec!["yogyrt".to_owned(), "gym".to_owned()],
	)
	.await?;
	let profile = create_image(profile, "terry1").await?;
	let profile = create_image(profile, "terry2").await?;
	let terry = create_image(profile, "terry3").await?;

	let amy_user = create_user("Amy", "Santiago", "amy@test.com").await?;
	let profile = update_profile(
		&amy_user,
		"Female",
		"Male",
		"I like to be organized with binders",
		vec!["organizing".to_owned(), "binders".to_owned()],
	)
	.await?;
	let profile = create_image(profile, "amy1").await?;
	let profile = create_image(profile, "amy2").await?;
	let amy = create_image(profile, "amy3").await?;

	let charles_user = create_user("Charles", "Boyle", "charles@test.com").await?;
	let profile = update_profile(
		&charles_user,
		"Male",
		"Female",
		"I like cooking strange stuff",
		vec!["cooking".to_owned()],
	)
	.await?;
	let profile = create_image(profile, "charles1").await?;
	let profile = create_image(profile, "charles2").await?;
	let charles = create_image(profile, "charles3").await?;

	let gina_user = create_user("Gina", "Linetti", "gina@test.com").await?;
	let profile = update_profile(
		&gina_user,
		"Female",
		"Male",
		"I am the real leader at 99.",
		vec!["plotting".to_owned(), "not-working".to_owned()],
	)
	.await?;
	let profile = create_image(profile, "gina1").await?;
	let profile = create_image(profile, "gina2").await?;
	let gina = create_image(profile, "gina3").await?;

	let holt_user = create_user("Raymond", "Holt", "raymond@test.com").await?;
	let profile = update_profile(
		&holt_user,
		"Male",
		"Male",
		"Captain at 99th precinct",
		vec!["classical-music".to_owned(), "dogs".to_owned()],
	)
	.await?;
	let profile = create_image(profile, "holt1").await?;
	let profile = create_image(profile, "holt2").await?;
	let holt = create_image(profile, "holt3").await?;

	let hitchcock_user = create_user("Michael", "Hitchcock", "michael@test.com").await?;
	let profile = update_profile(
		&hitchcock_user,
		"Male",
		"Female",
		"I work with my pal Scully at 99.",
		vec!["pizza".to_owned(), "chairs".to_owned()],
	)
	.await?;
	let profile = create_image(profile, "hitchcock1").await?;
	let profile = create_image(profile, "hitchcock2").await?;
	let hitchcock = create_image(profile, "hitchcock3").await?;

	let scully_user = create_user("Norm", "Scully", "norm@test.com").await?;
	let profile = update_profile(
		&scully_user,
		"Male",
		"Female",
		"I work with my pal Hitchcock at 99.",
		vec!["pizza".to_owned(), "chairs".to_owned()],
	)
	.await?;
	let profile = create_image(profile, "scully1").await?;
	let profile = create_image(profile, "scully2").await?;
	let scully = create_image(profile, "scully3").await?;

	visit(&jake.key, &rosa.key).await?;
	visit(&jake.key, &amy.key).await?;
	visit(&jake.key, &charles.key).await?;
	visit(&jake.key, &terry.key).await?;
	visit(&jake.key, &holt.key).await?;
	like(&jake_user, &amy.key).await?;
	like(&jake_user, &holt.key).await?;
	like(&jake_user, &charles.key).await?;

	visit(&rosa.key, &amy.key).await?;
	visit(&rosa.key, &gina.key).await?;
	visit(&rosa.key, &jake.key).await?;
	like(&rosa_user, &gina.key).await?;
	like(&rosa_user, &terry.key).await?;
	like(&rosa_user, &amy.key).await?;

	visit(&amy.key, &gina.key).await?;
	visit(&amy.key, &rosa.key).await?;
	visit(&amy.key, &holt.key).await?;
	visit(&amy.key, &jake.key).await?;
	like(&amy_user, &rosa.key).await?;
	like(&amy_user, &holt.key).await?;
	like(&amy_user, &gina.key).await?;
	like(&amy_user, &jake.key).await?;

	visit(&charles.key, &gina.key).await?;
	visit(&charles.key, &terry.key).await?;
	visit(&charles.key, &jake.key).await?;
	like(&charles_user, &amy.key).await?;
	like(&charles_user, &jake.key).await?;
	like(&charles_user, &terry.key).await?;
	like(&charles_user, &holt.key).await?;

	visit(&terry.key, &jake.key).await?;
	visit(&terry.key, &holt.key).await?;
	visit(&terry.key, &amy.key).await?;
	visit(&terry.key, &scully.key).await?;
	like(&terry_user, &rosa.key).await?;
	like(&terry_user, &amy.key).await?;
	like(&terry_user, &jake.key).await?;
	like(&terry_user, &scully.key).await?;
	like(&terry_user, &holt.key).await?;

	visit(&gina.key, &jake.key).await?;
	visit(&gina.key, &holt.key).await?;
	visit(&gina.key, &amy.key).await?;
	visit(&gina.key, &rosa.key).await?;
	visit(&gina.key, &terry.key).await?;
	like(&gina_user, &rosa.key).await?;
	like(&gina_user, &amy.key).await?;
	like(&gina_user, &terry.key).await?;

	visit(&holt.key, &amy.key).await?;
	visit(&holt.key, &terry.key).await?;
	visit(&holt.key, &scully.key).await?;
	visit(&holt.key, &hitchcock.key).await?;
	like(&holt_user, &terry.key).await?;
	like(&holt_user, &jake.key).await?;
	like(&holt_user, &amy.key).await?;
	like(&holt_user, &hitchcock.key).await?;
	like(&holt_user, &scully.key).await?;


	visit(&scully.key, &terry.key).await?;
	visit(&scully.key, &jake.key).await?;
	visit(&scully.key, &holt.key).await?;
	visit(&scully.key, &amy.key).await?;
	visit(&scully.key, &hitchcock.key).await?;
	like(&scully_user, &terry.key).await?;
	like(&scully_user, &hitchcock.key).await?;
	like(&scully_user, &jake.key).await?;

	visit(&hitchcock.key, &terry.key).await?;
	visit(&hitchcock.key, &gina.key).await?;
	visit(&hitchcock.key, &charles.key).await?;
	visit(&hitchcock.key, &scully.key).await?;
	like(&hitchcock_user, &scully.key).await?;
	like(&hitchcock_user, &rosa.key).await?;
	like(&hitchcock_user, &gina.key).await?;

	Ok(())
}

async fn create_user(f: &str, l: &str, e: &str) -> Result<User, AppError> {
	let body = json!({
		"firstName": f,
		"lastName": l,
		"username": f,
		"emailAddress": e,
		"password": "Passw0rd!"
	});

	let data: RegisterFormValues = serde_json::from_value(body)?;
	user::register::register(data).await?;
	if let Some(user) = User::find("emailAddress", e).await?.pop() {
		Ok(user)
	} else {
		Err(AppError::internal("seed create_user failed"))
	}
}

async fn update_profile(
	user: &User,
	g: &str,
	s: &str,
	b: &str,
	i: Vec<String>,
) -> Result<Profile, AppError> {
	let int = profile::interest::create(i).await?;
	let profile = Profile::get(&user.profile).await?;

	let body = json!({
		"firstName": &profile.first_name,
		"lastName": &profile.last_name,
		"gender": g,
		"sexualPreference": s,
		"biography": b,
		"interests": int,
	});

	let data: ProfileFormValues = serde_json::from_value(body)?;

	profile.update_from_form(&data).await?;

	let profile = Profile::get(&user.profile).await?;
	Ok(profile)
}

async fn create_image(mut profile: Profile, file: &str) -> Result<Profile, AppError> {
	let url = format!("{}_api/document/images/", env::var("DB_URL")?);

	let body = json!({
		"_key": file,
		"isMain": profile.images.is_empty(),
	});


	api::post::<Value, CreateResponse>(&url, &body).await?;
	profile.images.push(file.to_owned());
	profile.update().await?;
	Ok(Profile::get(&profile.key).await?)
}

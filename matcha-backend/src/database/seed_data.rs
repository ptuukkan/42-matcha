use serde_json::Value;
use crate::models::base::CreateResponse;
use crate::application::profile;
use crate::application::user;
use crate::database::api;
use crate::errors::AppError;
use crate::models::profile::Profile;
use crate::models::profile::ProfileFormValues;
use crate::models::user::RegisterFormValues;
use crate::models::user::User;
use serde_json::json;
use std::env;

pub async fn seed_data() -> Result<(), AppError> {


	let user = create_user("Jake", "Peralta", "jake@test.com").await?;
	let profile = update_profile(
		&user,
		"Male",
		"Female",
		"Ultimate detective / genius",
		vec!["die-hard".to_owned()],
	)
	.await?;
	let profile = create_image(profile, "jake1").await?;
	let profile = create_image(profile, "jake2").await?;
	let jake = create_image(profile, "jake3").await?;

	let user = create_user("Rosa", "Diaz", "rosa@test.com").await?;
	let profile = update_profile(
		&user,
		"Female",
		"Male",
		"This is dumb",
		vec!["motorcycles".to_owned()],
	)
	.await?;
	let profile = create_image(profile, "rosa1").await?;
	let profile = create_image(profile, "rosa2").await?;
	let rosa = create_image(profile, "rosa3").await?;

	let user = create_user("Terry", "Jeffords", "terry@test.com").await?;
	let profile = update_profile(
		&user,
		"Male",
		"Female",
		"I like yogurt and gym",
		vec!["yogyrt".to_owned(), "gym".to_owned()],
	)
	.await?;
	let profile = create_image(profile, "terry1").await?;
	let profile = create_image(profile, "terry2").await?;
	let terry = create_image(profile, "terry3").await?;

	let user = create_user("Amy", "Santiago", "amy@test.com").await?;
	let profile = update_profile(
		&user,
		"Female",
		"Male",
		"I like to be organized with binders",
		vec!["organizing".to_owned(), "binders".to_owned()],
	)
	.await?;
	let profile = create_image(profile, "amy1").await?;
	let profile = create_image(profile, "amy2").await?;
	let amy = create_image(profile, "amy3").await?;

	let user = create_user("Charles", "Boyle", "charles@test.com").await?;
	let profile = update_profile(
		&user,
		"Male",
		"Female",
		"I like cooking strange stuff",
		vec!["cooking".to_owned()],
	)
	.await?;
	let profile = create_image(profile, "charles1").await?;
	let profile = create_image(profile, "charles2").await?;
	let charles = create_image(profile, "charles3").await?;

	let user = create_user("Gina", "Linetti", "gina@test.com").await?;
	let profile = update_profile(
		&user,
		"Female",
		"Male",
		"I am the real leader at 99.",
		vec!["plotting".to_owned(), "not-working".to_owned()],
	)
	.await?;
	let profile = create_image(profile, "gina1").await?;
	let profile = create_image(profile, "gina2").await?;
	let gina = create_image(profile, "gina3").await?;

	let user = create_user("Raymond", "Holt", "raymond@test.com").await?;
	let profile = update_profile(
		&user,
		"Male",
		"Male",
		"Captain at 99th precinct",
		vec!["classical-music".to_owned(), "dogs".to_owned()],
	)
	.await?;
	let profile = create_image(profile, "holt1").await?;
	let profile = create_image(profile, "holt2").await?;
	let holt = create_image(profile, "holt3").await?;

	let user = create_user("Michael", "Hitchcock", "michael@test.com").await?;
	let profile = update_profile(
		&user,
		"Male",
		"Female",
		"I work with my pal Scully at 99.",
		vec!["pizza".to_owned(), "chairs".to_owned()],
	)
	.await?;
	let profile = create_image(profile, "hitchcock1").await?;
	let profile = create_image(profile, "hitchcock2").await?;
	let hitchcock = create_image(profile, "hitchcock3").await?;

	let user = create_user("Norm", "Scully", "norm@test.com").await?;
	let profile = update_profile(
		&user,
		"Male",
		"Female",
		"I work with my pal Hitchcock at 99.",
		vec!["pizza".to_owned(), "chairs".to_owned()],
	)
	.await?;
	let profile = create_image(profile, "scully1").await?;
	let profile = create_image(profile, "scully2").await?;
	let scully = create_image(profile, "scully3").await?;

	jake.like(&charles.key).await?;
	jake.like(&amy.key).await?;
	jake.visit(&charles.key).await?;
	jake.visit(&amy.key).await?;
	jake.visit(&terry.key).await?;
	jake.visit(&holt.key).await?;

	rosa.like(&hitchcock.key).await?;
	rosa.like(&scully.key).await?;
	rosa.like(&jake.key).await?;
	rosa.like(&gina.key).await?;
	rosa.visit(&hitchcock.key).await?;
	rosa.visit(&scully.key).await?;
	rosa.visit(&jake.key).await?;
	rosa.visit(&gina.key).await?;
	rosa.visit(&amy.key).await?;

	amy.like(&jake.key).await?;
	amy.like(&holt.key).await?;
	amy.like(&terry.key).await?;
	amy.like(&rosa.key).await?;
	amy.visit(&jake.key).await?;
	amy.visit(&holt.key).await?;
	amy.visit(&terry.key).await?;
	amy.visit(&gina.key).await?;
	amy.visit(&rosa.key).await?;

	charles.like(&jake.key).await?;
	charles.like(&gina.key).await?;
	charles.like(&amy.key).await?;
	charles.visit(&jake.key).await?;
	charles.visit(&gina.key).await?;
	charles.visit(&amy.key).await?;
	charles.visit(&holt.key).await?;

	terry.like(&jake.key).await?;
	terry.like(&amy.key).await?;
	terry.like(&holt.key).await?;
	terry.visit(&jake.key).await?;
	terry.visit(&holt.key).await?;
	terry.visit(&gina.key).await?;
	terry.visit(&amy.key).await?;

	holt.like(&terry.key).await?;
	holt.like(&amy.key).await?;
	holt.like(&jake.key).await?;
	holt.visit(&terry.key).await?;
	holt.visit(&amy.key).await?;
	holt.visit(&jake.key).await?;
	holt.visit(&scully.key).await?;
	holt.visit(&hitchcock.key).await?;

	scully.like(&hitchcock.key).await?;
	scully.visit(&hitchcock.key).await?;
	scully.visit(&holt.key).await?;

	hitchcock.like(&scully.key).await?;
	hitchcock.visit(&scully.key).await?;
	hitchcock.visit(&holt.key).await?;

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

use crate::WsServer;
use actix::Addr;
use crate::application::user;
use crate::application::{profile, profile::like, profile::utils::visit};
use crate::database::api;
use crate::database::setup;
use crate::errors::AppError;
use crate::models::base::CreateResponse;
use crate::models::profile::Profile;
use crate::models::profile::ProfileFormValues;
use crate::models::user::RegisterFormValues;
use crate::models::user::User;
use serde_json::json;
use serde_json::Value;
use std::env;

pub async fn seed_data(ws_srv: Addr<WsServer>) -> Result<(), AppError> {
	setup::reset_db().await?;
	setup::arango_setup().await?;

	let jake_user = create_user("Jake", "Peralta", "jake@test.com").await?;
	let profile = update_profile(
		&jake_user,
		"Male",
		"Female",
		"Ultimate detective / genius",
		vec!["die-hard", "beer", "movies", "guns", "video-games", "cooking", "jogging", "laser-tag"],
		"1990-01-28",
		60.2,
		24.9
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
		vec!["motorcycles", "beer", "guns", "kung-fu", "karate", "boxing", "jogging"],
		"1987-05-03",
		60.2,
		25.05
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
		vec!["yogurt", "gym", "beer", "whisky", "boxing", "child-care", "hiking", "football"],
		"1983-10-13",
		60.3,
		25.04
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
		vec!["organizing", "binders", "movies", "video-games", "reading", "math", "cooking", "board-games", "cocktails"],
		"1992-09-20",
		60.2,
		24.8
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
		vec!["cooking", "child-care", "hiking", "movies", "reading", "board-games", "surfing", "cocktails"],
		"1980-12-04",
		60.1,
		24.5
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
		vec!["plotting", "not-working", "vlog", "gossip", "cocktails", "gym", "fashion", "guns"],
		"1986-03-19",
		60.167,
		24.935
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
		vec!["classical-music", "dogs", "whisky", "jogging", "reading", "polo", "cricket", "bowling"],
		"1970-06-07",
		60.1618,
		24.787
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
		vec!["pizza", "chairs", "eating", "movies", "gambling", "not-working"],
		"1972-04-22",
		60.403,
		25.103
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
		vec!["pizza", "chairs", "eating", "movies", "not-working", "gambling"],
		"1974-08-30",
		60.376,
		26.264
	)
	.await?;
	let profile = create_image(profile, "scully1").await?;
	let profile = create_image(profile, "scully2").await?;
	let scully = create_image(profile, "scully3").await?;

	visit(&jake.key, &rosa.key, ws_srv.clone()).await?;
	visit(&jake.key, &amy.key, ws_srv.clone()).await?;
	visit(&jake.key, &charles.key, ws_srv.clone()).await?;
	visit(&jake.key, &terry.key, ws_srv.clone()).await?;
	visit(&jake.key, &holt.key, ws_srv.clone()).await?;
	like(&jake_user, &amy.key, ws_srv.clone()).await?;
	like(&jake_user, &holt.key, ws_srv.clone()).await?;
	like(&jake_user, &charles.key, ws_srv.clone()).await?;

	visit(&rosa.key, &amy.key, ws_srv.clone()).await?;
	visit(&rosa.key, &gina.key, ws_srv.clone()).await?;
	visit(&rosa.key, &jake.key, ws_srv.clone()).await?;
	like(&rosa_user, &gina.key, ws_srv.clone()).await?;
	like(&rosa_user, &terry.key, ws_srv.clone()).await?;
	like(&rosa_user, &amy.key, ws_srv.clone()).await?;

	visit(&amy.key, &gina.key, ws_srv.clone()).await?;
	visit(&amy.key, &rosa.key, ws_srv.clone()).await?;
	visit(&amy.key, &holt.key, ws_srv.clone()).await?;
	visit(&amy.key, &jake.key, ws_srv.clone()).await?;
	like(&amy_user, &rosa.key, ws_srv.clone()).await?;
	like(&amy_user, &holt.key, ws_srv.clone()).await?;
	like(&amy_user, &gina.key, ws_srv.clone()).await?;
	like(&amy_user, &jake.key, ws_srv.clone()).await?;

	visit(&charles.key, &gina.key, ws_srv.clone()).await?;
	visit(&charles.key, &terry.key, ws_srv.clone()).await?;
	visit(&charles.key, &jake.key, ws_srv.clone()).await?;
	like(&charles_user, &amy.key, ws_srv.clone()).await?;
	like(&charles_user, &jake.key, ws_srv.clone()).await?;
	like(&charles_user, &terry.key, ws_srv.clone()).await?;
	like(&charles_user, &holt.key, ws_srv.clone()).await?;

	visit(&terry.key, &jake.key, ws_srv.clone()).await?;
	visit(&terry.key, &holt.key, ws_srv.clone()).await?;
	visit(&terry.key, &amy.key, ws_srv.clone()).await?;
	visit(&terry.key, &scully.key, ws_srv.clone()).await?;
	like(&terry_user, &rosa.key, ws_srv.clone()).await?;
	like(&terry_user, &amy.key, ws_srv.clone()).await?;
	like(&terry_user, &jake.key, ws_srv.clone()).await?;
	like(&terry_user, &scully.key, ws_srv.clone()).await?;
	like(&terry_user, &holt.key, ws_srv.clone()).await?;

	visit(&gina.key, &jake.key, ws_srv.clone()).await?;
	visit(&gina.key, &holt.key, ws_srv.clone()).await?;
	visit(&gina.key, &amy.key, ws_srv.clone()).await?;
	visit(&gina.key, &rosa.key, ws_srv.clone()).await?;
	visit(&gina.key, &terry.key, ws_srv.clone()).await?;
	like(&gina_user, &rosa.key, ws_srv.clone()).await?;
	like(&gina_user, &amy.key, ws_srv.clone()).await?;
	like(&gina_user, &terry.key, ws_srv.clone()).await?;

	visit(&holt.key, &amy.key, ws_srv.clone()).await?;
	visit(&holt.key, &terry.key, ws_srv.clone()).await?;
	visit(&holt.key, &scully.key, ws_srv.clone()).await?;
	visit(&holt.key, &hitchcock.key, ws_srv.clone()).await?;
	like(&holt_user, &terry.key, ws_srv.clone()).await?;
	like(&holt_user, &jake.key, ws_srv.clone()).await?;
	like(&holt_user, &amy.key, ws_srv.clone()).await?;
	like(&holt_user, &hitchcock.key, ws_srv.clone()).await?;
	like(&holt_user, &scully.key, ws_srv.clone()).await?;

	visit(&scully.key, &terry.key, ws_srv.clone()).await?;
	visit(&scully.key, &jake.key, ws_srv.clone()).await?;
	visit(&scully.key, &holt.key, ws_srv.clone()).await?;
	visit(&scully.key, &amy.key, ws_srv.clone()).await?;
	visit(&scully.key, &hitchcock.key, ws_srv.clone()).await?;
	like(&scully_user, &terry.key, ws_srv.clone()).await?;
	like(&scully_user, &hitchcock.key, ws_srv.clone()).await?;
	like(&scully_user, &jake.key, ws_srv.clone()).await?;

	visit(&hitchcock.key, &terry.key, ws_srv.clone()).await?;
	visit(&hitchcock.key, &gina.key, ws_srv.clone()).await?;
	visit(&hitchcock.key, &charles.key, ws_srv.clone()).await?;
	visit(&hitchcock.key, &scully.key, ws_srv.clone()).await?;
	like(&hitchcock_user, &scully.key, ws_srv.clone()).await?;
	like(&hitchcock_user, &rosa.key, ws_srv.clone()).await?;
	like(&hitchcock_user, &gina.key, ws_srv.clone()).await?;

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

#[allow(clippy::too_many_arguments)]
async fn update_profile(
	user: &User,
	gender: &str,
	sexpref: &str,
	bio: &str,
	interests: Vec<&str>,
	birth_date: &str,
	latitude: f32,
	longitude: f32,
) -> Result<Profile, AppError> {
	let mut owned_interests: Vec<String> = vec![];
	for i in interests {
		owned_interests.push(i.to_owned());
	}
	let int = profile::interest::create(owned_interests).await?;
	let p = Profile::get(&user.profile).await?;

	let body = json!({
		"firstName": &p.first_name,
		"lastName": &p.last_name,
		"gender": gender,
		"sexualPreference": sexpref,
		"biography": bio,
		"interests": int,
		"birthDate": format!("{}T", birth_date),
		"locationOverride": true,
		"location": {
			"latitude": latitude,
			"longitude": longitude,
		}
	});

	let data: ProfileFormValues = serde_json::from_value(body)?;
	profile::update(user, data).await?;

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

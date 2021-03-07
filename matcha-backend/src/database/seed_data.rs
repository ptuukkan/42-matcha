use crate::models::user::User;

pub async fn seed_data() {
	let bob = User::new("bob.matthews@email.com", "password", "bob");
	let john = User::new("john.ausin@email.com", "password", "john");
	let kate = User::new("kate.simpson@email.com", "password", "kate");
	let mark = User::new("mark.blair@email.com", "password", "mark");

	bob.create().await.expect("Seed failed");
	john.create().await.expect("Seed failed");
	kate.create().await.expect("Seed failed");
	mark.create().await.expect("Seed failed");
}

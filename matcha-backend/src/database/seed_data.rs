use crate::models::user::User;

pub async fn seed_data() {
	let bob = User::new("Bob", "Matthews", "bob.matthews@email.com", "password", "bob");
	let john = User::new("John", "Austin", "john.ausin@email.com", "password", "john");
	let kate = User::new("Kate", "Simpson", "kate.simpson@email.com", "password", "kate");
	let mark = User::new("Mark", "Blair", "mark.blair@email.com", "password", "mark");

	bob.create().await.expect("Seed failed");
	john.create().await.expect("Seed failed");
	kate.create().await.expect("Seed failed");
	mark.create().await.expect("Seed failed");

}


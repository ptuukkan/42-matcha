use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct User {
	pub first_name: String,
	pub last_name: String,
	pub email_address: String,
	pub username: String,
	pub password: String,
}

impl User {
	pub fn valid() -> Self {
		Self {
			first_name: "Teppo".to_owned(),
			last_name: "Testaaja".to_owned(),
			username: "tepe".to_owned(),
			email_address: "tepe@localhost.com".to_owned(),
			password: "Password123!".to_owned(),
		}
	}

	pub fn dup_username() -> Self {
		Self {
			first_name: "Tavis".to_owned(),
			last_name: "Tallaaja".to_owned(),
			username: "bob".to_owned(),
			email_address: "tale@localhost".to_owned(),
			password: "Password123!".to_owned(),
		}
	}

	pub fn dup_email() -> Self {
		Self {
			first_name: "Tavis".to_owned(),
			last_name: "Tallaaja".to_owned(),
			username: "tale".to_owned(),
			email_address: "bob.matthews@email.com".to_owned(),
			password: "Password123!".to_owned(),
		}
	}

	pub fn dup_user_email() -> Self {
		Self {
			first_name: "Tavis".to_owned(),
			last_name: "Tallaaja".to_owned(),
			username: "bob".to_owned(),
			email_address: "bob.matthews@email.com".to_owned(),
			password: "Password123!".to_owned(),
		}
	}

	pub fn empty() -> Self {
		Self {
			first_name: "".to_owned(),
			last_name: "".to_owned(),
			username: "".to_owned(),
			email_address: "".to_owned(),
			password: "".to_owned(),
		}
	}
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LoginValues {
	pub email_address: String,
	pub password: String,
}

impl LoginValues {
	pub fn valid() -> Self {
		Self {
			email_address: "bob.matthews@email.com".to_owned(),
			password: "Password123!".to_owned(),
		}
	}

	pub fn invalid_password() -> Self {
		Self {
			email_address: "bob.matthews@email.com".to_owned(),
			password: "Passworda123!".to_owned(),
		}
	}

	pub fn invalid_email() -> Self {
		Self {
			email_address: "bob.mattheaws@email.com".to_owned(),
			password: "Password123!".to_owned(),
		}
	}

	pub fn invalid_password_email() -> Self {
		Self {
			email_address: "bob.maatthews@email.com".to_owned(),
			password: "Passworad123!".to_owned(),
		}
	}

	pub fn empty() -> Self {
		Self {
			email_address: "".to_owned(),
			password: "".to_owned(),
		}
	}
}

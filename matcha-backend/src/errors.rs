use crate::database::cursor::CursorResponse;
use actix_web::{
	client::SendRequestError, dev::HttpResponseBuilder, error::PayloadError, http::header,
	http::StatusCode, HttpResponse, ResponseError,
};
use derive_more::Display;
use serde::Serialize;
use std::env;

#[derive(Serialize, Debug, Display)]
pub enum AppError {
	#[display(fmt = "validation error")]
	ValidationError(ValidationError),

	#[display(fmt = "internal error")]
	InternalError(InternalError),

	#[display(fmt = "unauthorized error")]
	UnauthorizedError(UnauthorizedError),

	#[display(fmt = "bad request error")]
	BadRequestError(BadRequestError),
}

#[derive(Serialize, Debug)]
pub enum AppErrorType {
	ValidationError,
	InternalError,
	UnauthorizedError,
	BadRequestError,
}

#[derive(Serialize, Debug)]
pub struct ValidationError {
	error_type: AppErrorType,
	pub errors: Vec<FieldError>,
}

#[derive(Serialize, Debug)]
pub struct FieldError {
	field: String,
	message: String,
}

#[derive(Serialize, Debug)]
pub struct InternalError {
	error_type: AppErrorType,
	message: String,
}

#[derive(Serialize, Debug)]
pub struct BadRequestError {
	error_type: AppErrorType,
	message: String,
}

#[derive(Serialize, Debug)]
pub struct UnauthorizedError {
	error_type: AppErrorType,
	message: String,
}

impl ValidationError {
	// pub fn new(field: &str, error: &str) -> Self {
	// 	let field_error = FieldError {
	// 		field: field.to_owned(),
	// 		error: error.to_owned()
	// 	};
	// 	Self {
	// 		error_type: AppErrorType::ValidationError,
	// 		errors: vec![field_error]
	// 	}
	// }

	pub fn empty() -> Self {
		Self {
			error_type: AppErrorType::ValidationError,
			errors: Vec::new(),
		}
	}

	pub fn add(&mut self, field: &str, message: &str) {
		let field_error = FieldError {
			field: field.to_owned(),
			message: message.to_owned(),
		};
		self.errors.push(field_error);
	}
}

impl AppError {
	pub fn unauthorized(text: &str) -> AppError {
		AppError::UnauthorizedError(UnauthorizedError::from(text))
	}

	pub fn internal(cursor_response: CursorResponse) -> AppError {
		AppError::InternalError(InternalError::from(cursor_response))
	}

	pub fn bad_request(text: &str) -> AppError {
		AppError::BadRequestError(BadRequestError::from(text))
	}
}

impl ResponseError for AppError {
	fn status_code(&self) -> StatusCode {
		match &self {
			AppError::ValidationError(_) => StatusCode::BAD_REQUEST,
			AppError::InternalError(_) => StatusCode::INTERNAL_SERVER_ERROR,
			AppError::UnauthorizedError(_) => StatusCode::UNAUTHORIZED,
			AppError::BadRequestError(_) => StatusCode::BAD_REQUEST,
		}
	}

	fn error_response(&self) -> HttpResponse {
		match &self {
			AppError::ValidationError(e) => HttpResponseBuilder::new(self.status_code())
				.set_header(header::CONTENT_TYPE, "application/json")
				.json(e),
			AppError::InternalError(e) => HttpResponseBuilder::new(self.status_code())
				.set_header(header::CONTENT_TYPE, "application/json")
				.json(e),
			AppError::UnauthorizedError(e) => HttpResponseBuilder::new(self.status_code())
				.set_header(header::CONTENT_TYPE, "application/json")
				.json(e),
			AppError::BadRequestError(e) => HttpResponseBuilder::new(self.status_code())
				.set_header(header::CONTENT_TYPE, "application/json")
				.json(e),
		}
	}
}

impl From<CursorResponse> for InternalError {
	fn from(cursor_response: CursorResponse) -> Self {
		Self {
			error_type: AppErrorType::InternalError,
			message: cursor_response.error_message.unwrap(),
		}
	}
}

impl From<&str> for InternalError {
	fn from(text: &str) -> Self {
		Self {
			error_type: AppErrorType::InternalError,
			message: text.to_owned(),
		}
	}
}

impl From<&str> for BadRequestError {
	fn from(text: &str) -> Self {
		Self {
			error_type: AppErrorType::BadRequestError,
			message: text.to_owned(),
		}
	}
}

impl From<String> for InternalError {
	fn from(text: String) -> Self {
		Self {
			error_type: AppErrorType::InternalError,
			message: text,
		}
	}
}

impl From<SendRequestError> for AppError {
	fn from(from_error: SendRequestError) -> Self {
		Self::InternalError(InternalError::from(from_error.to_string()))
	}
}

impl From<actix_web::error::Error> for AppError {
	fn from(from_error: actix_web::error::Error) -> Self {
		Self::InternalError(InternalError::from(from_error.to_string()))
	}
}

impl From<PayloadError> for AppError {
	fn from(from_error: PayloadError) -> Self {
		Self::InternalError(InternalError::from(from_error.to_string()))
	}
}

impl From<serde_json::Error> for AppError {
	fn from(from_error: serde_json::Error) -> Self {
		Self::InternalError(InternalError::from(from_error.to_string()))
	}
}

impl From<env::VarError> for AppError {
	fn from(from_error: env::VarError) -> Self {
		Self::InternalError(InternalError::from(from_error.to_string()))
	}
}

impl From<lettre_email::error::Error> for AppError {
	fn from(from_error: lettre_email::error::Error) -> Self {
		Self::InternalError(InternalError::from(from_error.to_string()))
	}
}

impl From<lettre::sendmail::error::Error> for AppError {
	fn from(from_error: lettre::sendmail::error::Error) -> Self {
		Self::InternalError(InternalError::from(from_error.to_string()))
	}
}

impl From<jsonwebtoken::errors::Error> for AppError {
	fn from(from_error: jsonwebtoken::errors::Error) -> Self {
		Self::InternalError(InternalError::from(from_error.to_string()))
	}
}

impl From<std::time::SystemTimeError> for AppError {
	fn from(from_error: std::time::SystemTimeError) -> Self {
		Self::InternalError(InternalError::from(from_error.to_string()))
	}
}

impl From<actix_web::http::header::ToStrError> for AppError {
	fn from(from_error: actix_web::http::header::ToStrError) -> Self {
		Self::InternalError(InternalError::from(from_error.to_string()))
	}
}


impl From<&str> for UnauthorizedError {
	fn from(text: &str) -> Self {
		Self {
			error_type: AppErrorType::UnauthorizedError,
			message: text.to_owned(),
		}
	}
}




use actix_web::{
	dev::HttpResponseBuilder,
	http::header, http::StatusCode,
	HttpResponse, ResponseError,
	client::SendRequestError,
	error::PayloadError,
	Error
};
use serde::Serialize;
use crate::database::cursor::CursorResponse;
use derive_more::{Display};

#[derive(Serialize, Debug, Display)]
pub enum AppError {
	#[display(fmt = "validation error")]
	ValidationError(ValidationError),

	#[display(fmt = "internal error")]
	InternalError(InternalError),

	#[display(fmt = "cursor error")]
	CursorError(CursorError),

	#[display(fmt = "login error")]
	LoginError(LoginError),
}

#[derive(Serialize, Debug)]
pub enum AppErrorType {
	ValidationError,
	InternalError,
	CursorError,
	LoginError,
}

#[derive(Serialize, Debug)]
pub struct ValidationError {
	error_type: AppErrorType,
	pub errors: Vec<FieldError>
}

#[derive(Serialize, Debug)]
pub struct FieldError {
	field: String,
    error: String
}

#[derive(Serialize, Debug)]
pub struct InternalError {
	error_type: AppErrorType,
	error: String
}

#[derive(Serialize, Debug)]
pub struct CursorError {
	error_type: AppErrorType,
	error: bool,
    code: i32,
    error_num: i32,
    error_message: String
}

#[derive(Serialize, Debug)]
pub struct LoginError {
	error_type: AppErrorType,
	error: String
}

impl ValidationError {
	pub fn new(field: &str, error: &str) -> Self {
		let field_error = FieldError {
			field: field.to_owned(),
			error: error.to_owned()
		};
		Self {
			error_type: AppErrorType::ValidationError,
			errors: vec![field_error]
		}
	}

	pub fn empty() -> Self {
		Self {
			error_type: AppErrorType::ValidationError,
			errors: Vec::new()
		}
	}

	pub fn add(&mut self, field: &str, error: &str) {
		let field_error = FieldError {
			field: field.to_owned(),
			error: error.to_owned()
		};
		self.errors.push(field_error);
	}
}

impl InternalError {
	pub fn new(error: &str) -> Self {
		Self {
			error_type: AppErrorType::InternalError,
			error: error.to_owned()
		}
	}
}

impl From<CursorResponse> for CursorError {
	fn from(cursor_response: CursorResponse) -> Self {
		Self {
			error_type: AppErrorType::CursorError,
			code: cursor_response.code,
			error: cursor_response.error,
			error_message: cursor_response.error_message.unwrap(),
			error_num: cursor_response.error_num.unwrap()
		}
	}
}

impl LoginError {
	pub fn new(error: &str) -> Self {
		Self {
			error_type: AppErrorType::LoginError,
			error: error.to_owned()
		}
	}
}

impl ResponseError for AppError {
	fn status_code(&self) -> StatusCode {
		match &self {
			AppError::ValidationError(_) => StatusCode::BAD_REQUEST,
			AppError::CursorError(_) => StatusCode::INTERNAL_SERVER_ERROR,
			AppError::InternalError(_) => StatusCode::INTERNAL_SERVER_ERROR,
			AppError::LoginError(_) => StatusCode::BAD_REQUEST
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
			AppError::CursorError(e) => HttpResponseBuilder::new(self.status_code())
				.set_header(header::CONTENT_TYPE, "application/json")
				.json(e),
			AppError::LoginError(e) => HttpResponseBuilder::new(self.status_code())
				.set_header(header::CONTENT_TYPE, "application/json")
				.json(e)
		}

	}
}

impl From<SendRequestError> for AppError {
	fn from(from_error: SendRequestError) -> Self {
		Self::InternalError(InternalError::new(&from_error.to_string()))
	}
}

impl From<Error> for AppError {
	fn from(from_error: Error) -> Self {
		Self::InternalError(InternalError::new(&from_error.to_string()))
	}
}

impl From<PayloadError> for AppError {
	fn from(from_error: PayloadError) -> Self {
		Self::InternalError(InternalError::new(&from_error.to_string()))
	}
}

impl From<serde_json::Error> for AppError {
	fn from(from_error: serde_json::Error) -> Self {
		Self::InternalError(InternalError::new(&from_error.to_string()))
	}
}

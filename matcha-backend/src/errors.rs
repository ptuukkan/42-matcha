
use actix_web::{
	dev::HttpResponseBuilder,
	http::header, http::StatusCode,
	HttpResponse, ResponseError,
	client::SendRequestError,
	error::PayloadError,
	Error
};
use serde::Serialize;
use std::fmt;
use crate::database::cursor::CursorResponse;
use derive_more::{Display};
use std::str::FromStr;

#[derive(Serialize, Debug, Display)]
pub enum AppErrorType {
	#[display(fmt = "validation error")]
	ValidationError(Vec<FieldError>),

	#[display(fmt = "cursor error")]
	CursorError(CursorError),

	#[display(fmt = "internal error: {}", error)]
	InternalError { error: String },

	#[display(fmt = " bad request: {}", error)]
	BadRequest { error: String }
}

#[derive(Serialize, Debug)]
pub struct FieldError {
	field: String,
    reason: String
}

#[derive(Serialize, Debug)]
pub struct CursorError {
	error: bool,
    code: i32,
    error_num: i32,
    error_message: String
}

#[derive(Serialize, Debug)]
pub struct AppError {
	#[serde(flatten)]
	pub error: AppErrorType,
}

#[derive(Serialize)]
pub struct AppErrorResponse {
	pub error: String
}

// impl AppError {
// 	fn message(&self) -> String {
// 		match self.error {
// 			AppErrorType::ValidationError(s) => s
// 		}
// 	}
// }

impl From<CursorResponse> for CursorError {
	fn from(cursor_response: CursorResponse) -> Self {
		Self {
			code: cursor_response.code,
			error: cursor_response.error,
			error_message: cursor_response.error_message.unwrap(),
			error_num: cursor_response.error_num.unwrap()
		}
	}
}

impl fmt::Display for AppError {
	fn fmt(&self, f: &mut fmt::Formatter<'_>) -> Result<(), fmt::Error> {
		write!(f, "{:?}", self)
	}
}

impl ResponseError for AppError {
	fn status_code(&self) -> StatusCode {
		match &self.error {
			AppErrorType::ValidationError(_) => StatusCode::BAD_REQUEST,
			AppErrorType::CursorError(_) => StatusCode::INTERNAL_SERVER_ERROR,
			AppErrorType::InternalError { error: _ } => StatusCode::INTERNAL_SERVER_ERROR,
			AppErrorType::BadRequest { error: _ } => StatusCode::BAD_REQUEST
		}
	}

	fn error_response(&self) -> HttpResponse {
		HttpResponseBuilder::new(self.status_code())
			.set_header(header::CONTENT_TYPE, "application/json")
			.json(self)

		// match self.error {
		// 	AppErrorType::CursorError(c) => HttpResponseBuilder::new(self.status_code())
		// 		.set_header(header::CONTENT_TYPE, "application/json")
		// 		.json(c),
		// 	_ => HttpResponseBuilder::new(self.status_code())
		// 	.set_header(header::CONTENT_TYPE, "application/json")
		// 	.json(self)
		// }

	}
}

impl FromStr for FieldError {
	type Err = AppError;

	fn from_str(s: &str) -> Result<Self, Self::Err> {
		let parts: Vec<&str> = s.split(':').collect();
		Ok(Self {
			field: parts[0].to_owned(),
			reason: parts[1].to_owned()
		})
	}
}

impl From<SendRequestError> for AppError {
	fn from(from_error: SendRequestError) -> Self {
		Self {
			error: AppErrorType::InternalError {
				error: from_error.to_string()
			}
		}
	}
}

impl From<Error> for AppError {
	fn from(from_error: Error) -> Self {
		Self {
			error: AppErrorType::InternalError {
				error: from_error.to_string()
			}
		}
	}
}

impl From<PayloadError> for AppError {
	fn from(from_error: PayloadError) -> Self {
		Self {
			error: AppErrorType::InternalError {
				error: from_error.to_string()
			}
		}
	}
}

impl From<serde_json::Error> for AppError {
	fn from(from_error: serde_json::Error) -> Self {
		Self {
			error: AppErrorType::InternalError {
				error: from_error.to_string()
			}
		}
	}
}

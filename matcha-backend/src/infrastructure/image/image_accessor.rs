use awmp::File;
use crate::errors::AppError;

pub fn save_image(image_file: File, image_key: &str) -> Result<(), AppError> {
	let file_path = format!("/tmp/{}.jpg", image_key);
	image_file.persist_at(&file_path)?;
	Ok(())
}

pub fn delete_image(_image_key: &str) -> Result<(), AppError> {
	Ok(())
}

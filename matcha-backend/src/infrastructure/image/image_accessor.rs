use awmp::File;
use crate::errors::AppError;
use nanoid::nanoid;

pub fn save_image(image: File) -> Result<String, AppError> {
	let id = nanoid!(10, &nanoid::alphabet::SAFE);
	let file_path = format!("tmp/{}", id);
	image.persist_at(&file_path)?;
	Ok(file_path)
}

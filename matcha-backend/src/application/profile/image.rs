use crate::errors::AppError;
use crate::infrastructure::image::image_accessor;

pub async fn create(mut parts: awmp::Parts) -> Result<(), AppError> {
	if let Some(image) = parts.files.take("image").pop() {
		let file_path = image_accessor::save_image(image)?;
	}
	
	Ok(())
}

import React, { useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

export interface IProps {
	setImage: (file: Blob) => void;
	imagePreview: string;
}

const PhotoCropper: React.FC<IProps> = ({ setImage, imagePreview }) => {
	const cropperRef = useRef<HTMLImageElement>(null);

	const cropImage = () => {
		const imageElement: any = cropperRef?.current;
		const cropper: any = imageElement?.cropper;

		cropper.getCroppedCanvas().toBlob((blob: any) => {
			setImage(blob);
		}, 'image/jpeg');
	};

	return (
		<Cropper
			ref={cropperRef}
			src={imagePreview}
			style={{ height: 200, width: '100%' }}
			aspectRatio={1 / 1}
			preview=".img-preview"
			guides={false}
			viewMode={1}
			dragMode="move"
			scalable={true}
			cropBoxMovable={true}
			cropBoxResizable={true}
			crop={cropImage}
		/>
	);
};

export default PhotoCropper;

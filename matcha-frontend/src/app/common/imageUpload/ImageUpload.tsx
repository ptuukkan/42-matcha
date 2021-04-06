import React, { Fragment, useEffect, useState } from 'react';
import { Button, Grid, Header } from 'semantic-ui-react';
import ImageCropper from './ImageCropper';
import ImageDropzone from './ImageDropzone';

export interface IProps {
	setAddImageMode: (value: boolean) => void;
	addImage: (data: FormData) => void;
}

const ImageUpload: React.FC<IProps> = ({ setAddImageMode, addImage }) => {
	const [files, setFiles] = useState<any[]>([]);
	const [image, setImage] = useState<Blob | null>(null);

	useEffect(() => {
		return () => {
			files.forEach((file) => URL.revokeObjectURL(file.preview));
		};
	});

	return (
		<Fragment>
			<Grid>
				<Grid.Column width={4}>
					<Header sub color="pink" content="Step 1 - Add image" />
					<ImageDropzone setFiles={setFiles} />
				</Grid.Column>
				<Grid.Column width={1} />
				<Grid.Column width={4}>
					<Header sub color="pink" content="Step 2 - Resize image" />
					{files.length > 0 && (
						<ImageCropper setImage={setImage} imagePreview={files[0].preview} />
					)}
				</Grid.Column>
				<Grid.Column width={1} />
				<Grid.Column width={4}>
					<Header sub color="pink" content="Step 3 - Preview and upload" />
					{files.length > 0 && (
						<Fragment>
							<div
								className="img-preview"
								style={{ minHeight: '200px', overflow: 'hidden' }}
							/>
							<Button.Group widths={4} style={{ width: '200px' }}>
								<Button
									type="button"
									positive
									icon="check"
									onClick={() => {
										let fd = new FormData();
										fd.append('image', image!);
										addImage(fd);
										setAddImageMode(false);
									}}
								/>
								<Button
									type="button"
									icon="close"
									onClick={() => setFiles([])}
								/>
							</Button.Group>
						</Fragment>
					)}
				</Grid.Column>
			</Grid>
		</Fragment>
	);
};

export default ImageUpload;

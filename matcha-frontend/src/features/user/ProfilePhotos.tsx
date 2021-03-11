import React, { Fragment, useEffect, useState } from 'react';
import { Button, Grid, Header } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import PhotoCropper from '../../app/common/photoUpload/PhotoCropper';
import AddPhoto from './AddPhoto';

export interface ProfilePhotosProps {
	loading: boolean;
	photoMode: (value: boolean) => void;
}

const ProfilePhotos: React.FC<ProfilePhotosProps> = ({ loading, photoMode }) => {
	const [files, setFiles] = useState<any[]>([]);
	const [image, setImage] = useState<Blob | null>(null);

	useEffect(() => {
		return () => {
			files.forEach((file) => URL.revokeObjectURL(file.preview));
		};
	});

	return (
		<div>
			<Grid>
				<Grid.Column width={4}>
					<Header sub color="pink" content="Step 1 - Add image" />
					<AddPhoto setFiles={setFiles} />
				</Grid.Column>
				<Grid.Column width={1} />
				<Grid.Column width={4}>
					<Header sub color="pink" content="Step 2 - Resize image" />
					{files.length > 0 && (
						<PhotoCropper setImage={setImage} imagePreview={files[0].preview} />
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
							<Button.Group widths={2}>
								<Button
									positive
									icon="check"
									loading={loading}
									onClick={() => {
										let fd = new FormData()
										fd.append('image', image!)
										agent.Profile.addImage(fd)
											.catch((e) => console.log(e))
											photoMode(false)
									}
									}
								/>
								<Button
									icon="close"
									disabled={loading}
									onClick={() => setFiles([])}
								/>
							</Button.Group>
						</Fragment>
					)}
				</Grid.Column>
			</Grid>
		</div>
	);
};

export default ProfilePhotos;

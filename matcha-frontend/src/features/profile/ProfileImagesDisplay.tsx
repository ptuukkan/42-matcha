import React, { Fragment } from 'react';
import { Card, Grid, Image } from 'semantic-ui-react';
import { IImage } from '../../app/models/profile';

interface IProps {
	images: IImage[];
}

const ProfileImagesDisplay: React.FC<IProps> = ({ images }) => {
	if (images.length < 2) return <Fragment />;

	return (
		<Grid columns={5} stackable style={{ marginTop: 50 }}>
			{images
				.filter((img) => !img.isMain)
				.map((image) => (
					<Grid.Column key={image.id}>
						<Card>
							<Image src={image.url} />
						</Card>
					</Grid.Column>
				))}
		</Grid>
	);
};

export default ProfileImagesDisplay;

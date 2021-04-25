import { observer } from 'mobx-react-lite';
import React from 'react';

import { Image, Button, Card, Grid } from 'semantic-ui-react';
import { IProfile } from '../../app/models/profile';

interface IProps {
	profile: IProfile;
	removeImage: (id: string) => void;
	setMain: (id: string) => void;
}

const ProfileFormImagesDisplay: React.FC<IProps> = ({
	profile,
	removeImage,
	setMain,
}) => {
	return (
		<Grid columns={5} stackable>
			{profile.images.map((image) => (
				<Grid.Column key={image.id}>
					<Card>
						<Image
							size="tiny"
							verticalAlign="middle"
							src={image.url}
							wrapped
							ui={false}
						/>
						<Button.Group fluid widths={2}>
							<Button
								type="button"
								onClick={() => setMain(image.id)}
								disabled={image.isMain}
								basic
								positive
								content="Main"
							/>
							<Button
								type="button"
								onClick={() => removeImage(image.id)}
								disabled={image.isMain}
								basic
								negative
								icon="trash"
							/>
						</Button.Group>
					</Card>
				</Grid.Column>
			))}
		</Grid>
	);
};

export default observer(ProfileFormImagesDisplay);

import { observer } from 'mobx-react-lite';

import { Image, Button, Card, Grid, CardContent } from 'semantic-ui-react';
import { IProfile } from '../../app/models/profile';

interface IProps {
	profile: IProfile | null;
	removeImage: (id: string) => void;
	setMain: (id: string) => void;
}

const ProfileImagesDisplay: React.FC<IProps> = ({ profile, removeImage, setMain }) => {
	return (
		<Grid.Column width={16}>
			<Grid.Row columns={6}>
				<Card.Group itemsPerRow={5}>
					{profile?.images.map((image) => (
						<Card key={image.id}>
							<Image
								size="tiny"
								verticalAlign="middle"
								src={image.url}
								wrapped
								ui={false}
							/>
							<Button.Group fluid widths={2}>
								<Button
									onClick={() => setMain(image.id)}
									disabled={image.isMain}
									basic
									positive
									content="Main"
								/>
								<Button
									onClick={() => removeImage(image.id)}
									disabled={image.isMain}
									basic
									negative
									icon="trash"
								/>
							</Button.Group>
						</Card>
					))}
				</Card.Group>
			</Grid.Row>
		</Grid.Column>
	);
};

export default observer(ProfileImagesDisplay);

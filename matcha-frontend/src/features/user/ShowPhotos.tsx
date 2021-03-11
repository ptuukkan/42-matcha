import { observer } from 'mobx-react-lite';
import agent from '../../app/api/agent';

import {
	Image,
	Button,
	Card,
	Grid,
	CardContent,
} from 'semantic-ui-react';
import { IProfile } from '../../app/models/profile';

interface IProps {
	profile: IProfile | null;
}

const ShowPhotos: React.FC<IProps> = (profile) => {
	return (
		<Grid.Column width={16}>
			<Grid.Row columns={6}>
				<Card.Group itemsPerRow={5}>
					{profile.profile?.images.map((image) => (
						<Card key={image.id}>
								<Image size="tiny" verticalAlign="middle" src={image.url} wrapped ui={false} />
							<CardContent/>

								<Button.Group fluid widths={2} >
									<Button
										onClick={() => agent.Profile.imageToMain(image.id)}
										disabled={image.isMain}
										basic
										positive
										content="Main"
									/>
									<Button
										onClick={() => agent.Profile.removeImage(image.id)}
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
	)
};

export default observer(ShowPhotos);

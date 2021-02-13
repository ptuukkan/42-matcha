import React from 'react';
import { Link } from 'react-router-dom';
import {
	Container,
	Card,
	Image,
	Label,
	Button,
} from 'semantic-ui-react';
import { IProfile } from '../../app/models/profile';

interface IProps {
	profiles: IProfile[];
}

const Matches: React.FC<IProps> = ({ profiles }) => {
	return (
		<Container>
			<Card.Group itemsPerRow={1}>
				{profiles.map((profile) => (
					<Card key={profile.location.latitude - Date.now()}>
						<Label
							color={
								Math.abs(Math.floor(profile.location.latitude)) <
								40
									? 'red'
									: 'green'
							}
							floating
						>
							{Math.abs(Math.floor(profile.location.latitude)) < 40
								? 'Offline'
								: 'Online'}
						</Label>
						<Image
							src={`https://robohash.org/${profile.firstName}`}
							wrapped
							ui={false}
						/>
						<Card.Content>
							<Card.Header as="h5">
								{profile.firstName} {profile.lastName}
							</Card.Header>
							Distance: {Math.floor(Math.random() * 80)} km
						</Card.Content>
						<Button color="red" icon="heart" content="Start Chat" as={Link} to={'/chat'}/>
					</Card>
				))}
			</Card.Group>
		</Container>
	);
};

export default Matches;

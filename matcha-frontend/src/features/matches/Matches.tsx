import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
	Container,
	Card,
	Image,
	Label,
	Button,
	Header,
} from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { IPublicProfile } from '../../app/models/profile';

const Matches = () => {
	const [profiles, setProfiles] = useState<IPublicProfile[]>([]);
	useEffect(() => {
		agent.Matches.list()
			.then((p) => setProfiles(p))
			.catch((e) => console.log(e));
	}, []);
	return profiles.length < 1 ? (
		<Header>No matches :(</Header>
	) : (
		<Container>
			<Card.Group itemsPerRow={2}>
				{profiles!.sort().map((profile) => (
					<Card key={profile.id} as={Link} to={`/profile/${profile.id}`}>
						<Label color={profile.fameRating > 5 ? 'grey' : 'pink'} floating>
							{profile.fameRating > 5 ? 'Offline' : 'Online'}
						</Label>
						<Image
							src={profile.images.find((i) => i.isMain)?.url}
							wrapped
							ui={false}
						/>
						<Card.Content>
							<Card.Header as="h5">
								{profile.firstName} {profile.lastName}
							</Card.Header>
							Distance: {profile.distance} km
						</Card.Content>
						{profile.fameRating < 5 && (
							<Button
								color="pink"
								icon="heart"
								size="huge"
								content="Start Chat"
								as={Link}
								to={'/chat'}
							/>
						)}
					</Card>
				))}
			</Card.Group>
		</Container>
	);
};

export default Matches;

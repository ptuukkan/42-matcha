import { profile } from 'console';
import React from 'react';
import { Link } from 'react-router-dom';
import { Image, Card, Header, Rating } from 'semantic-ui-react';
import { IPublicProfile } from '../../app/models/profile';

interface IProps {
	profile: IPublicProfile;
}

const ResearchListItem: React.FC<IProps> = ({ profile }) => {
	return (
		<Card key={profile.id} as={Link} to={`/profile/${profile.id}`}>
			<Image
				src={profile.images.find((i) => i.isMain)?.url}
				wrapped
				ui={false}
			/>
			<Card.Content>
				<Card.Header>
					{profile.firstName} {profile.lastName}, {profile.age}
				</Card.Header>
				<Card.Meta>{profile.distance} km away</Card.Meta>
				<Card.Description>
					<Rating
						icon="heart"
						disabled
						rating={profile.fameRating}
						maxRating={10}
					/>
				</Card.Description>
			</Card.Content>
		</Card>
	);
};

export default ResearchListItem;

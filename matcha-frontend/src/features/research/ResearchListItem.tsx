import React from 'react';
import { Link } from 'react-router-dom';
import { Image, Rating, GridColumn, Header } from 'semantic-ui-react';
import { IPublicProfile } from '../../app/models/profile';

interface IProps {
	profile: IPublicProfile;
}

const ResearchListItem: React.FC<IProps> = ({ profile }) => {
	return (
		<GridColumn key={profile.id} as={Link} to={`/profile/${profile.id}`}>
			<Image src={profile.images.find((i) => i.isMain)?.url} wrapped fluid />
			<Header>
				{profile.firstName} {profile.lastName}, {profile.age}
			</Header>
			<p>{profile.distance} km away</p>
			<Rating
				icon="heart"
				disabled
				rating={profile.fameRating}
				maxRating={10}
			/>
		</GridColumn>
	);
};

export default ResearchListItem;

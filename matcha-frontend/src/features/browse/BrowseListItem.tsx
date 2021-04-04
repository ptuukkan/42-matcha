import React from 'react';
import { Link } from 'react-router-dom';
import { Image, Card, Header, Icon, Rating, Button } from 'semantic-ui-react';
import { IPublicProfile } from '../../app/models/profile';
import BrowseListItemInterests from './BrowseListItemInterests';
import BrowseListItemLikeButton from './BrowseListItemLikeButton';

interface IProps {
	profile: IPublicProfile;
	profiles: IPublicProfile[];
	setProfiles: React.Dispatch<React.SetStateAction<IPublicProfile[]>>;
}

const BrowseListItem: React.FC<IProps> = ({
	profile,
	profiles,
	setProfiles,
}) => {
	return (
		<Card fluid>
			<Image
				src={profile.images.find((i) => i.isMain)?.url}
				wrapped
				ui={false}
				as={Link}
				to={`/profile/${profile.id}`}
			/>
			<div className="profileinfo">
				<Header as="h1">{`${profile.firstName}, ${profile.age}  ${profile.compatibilityRating}`}</Header>
				<Icon name={profile.gender === 'Female' ? 'mars' : 'venus'} />
				Distance: {profile.distance} km
				<br></br>
				<BrowseListItemInterests interests={profile.interests} />
				<Header>Fame Rating</Header>
				<Rating
					icon="heart"
					disabled
					rating={profile.fameRating}
					maxRating={10}
				/>
				<Card.Description>{profile.biography}</Card.Description>
				<br></br>
				<Button
					as={Link}
					to={`/profile/${profile.id}`}
					color="pink"
					content="View Profile"
				/>
				<BrowseListItemLikeButton
					profile={profile}
					profiles={profiles}
					setProfiles={setProfiles}
				/>
			</div>
		</Card>
	);
};

export default BrowseListItem;

import React from 'react';
import { Link } from 'react-router-dom';
import { Image, Card, Header, Rating, Button } from 'semantic-ui-react';
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
				fluid
			/>
			<div className="profileinfo">
				<Card.Header as="h1" style={{ marginBottom: 0 }}>
					{`${profile.firstName}, ${profile.age}`}{' '}
					<span style={{ float: 'right' }}>
						<Rating
							icon="heart"
							disabled
							rating={profile.fameRating}
							maxRating={10}
						/>
					</span>
				</Card.Header>
				<Card.Meta style={{ fontSize: '1.2em' }}>
					{profile.compatibilityRating}% compatible
					<span style={{ float: 'right' }}>{profile.distance} km away</span>
				</Card.Meta>
				<BrowseListItemInterests interests={profile.interests} />

				<Header sub color="pink" content="Biography" />
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

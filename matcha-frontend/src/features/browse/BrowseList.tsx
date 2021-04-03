import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
	Image,
	Button,
	Card,
	Header,
	Icon,
	Rating,
	Label,
} from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { IPublicProfile } from '../../app/models/profile';

interface IProps {
	profiles: IPublicProfile[];
	setProfiles: React.Dispatch<React.SetStateAction<IPublicProfile[]>>;
}

const BrowseList: React.FC<IProps> = ({ setProfiles, profiles }) => {
	const like = (p: IPublicProfile) => {
		agent.Profile.like(p.id)
			.then((res) => {
				let updatedProfile = res.connected
					? { ...p, liked: true, connected: true }
					: { ...p, liked: true };
				setProfiles(
					profiles.map((profile) =>
						profile.id !== updatedProfile.id ? profile : updatedProfile
					)
				);
			})
			.catch((error) => console.log(error));
	};

	const unlike = (p: IPublicProfile) => {
		agent.Profile.unlike(p.id)
			.then(() => {
				let updatedProfile = { ...p, liked: false };
				setProfiles(
					profiles.map((profile) =>
						profile.id !== updatedProfile.id ? profile : updatedProfile
					)
				);
			})
			.catch((error) => console.log(error));
	};

	return (
		<Fragment>
			{profiles.map((p) => (
				<Card fluid key={p.id}>
					<Image
						src={p.images.find((i) => i.isMain)?.url}
						wrapped
						ui={false}
						as={Link}
						to={`/profile/${p.id}`}
					/>
					<div className="profileinfo">
						<Header as="h1">{`${p.firstName}, ${p.age}`}</Header>
						<Icon name={p.gender === 'Female' ? 'mars' : 'venus'} />
						Distance: {p.distance} km
						<br></br>
						Common interests: {p.commonInterests}
						<br></br>
						{p.interests.map((inter) => (
							<Label color="blue" key={inter}>
								{inter}
							</Label>
						))}
						<Header>Fame Rating</Header>
						<Rating
							icon="heart"
							disabled
							rating={p.fameRating}
							maxRating={10}
						/>
						<Card.Description>{p.biography}</Card.Description>
						<br></br>
						<Button as={Link} to={`/profile/${p.id}`} color={'red'}>
							View profile
						</Button>
						<Button
							content={!p.liked ? 'Like' : 'Unlike'}
							icon={!p.liked ? 'like' : 'cancel'}
							floated="right"
							color={!p.liked ? 'red' : 'black'}
							onClick={!p.liked ? () => like(p) : () => unlike(p)}
						/>
					</div>
				</Card>
			))}
		</Fragment>
	);
};

export default BrowseList;

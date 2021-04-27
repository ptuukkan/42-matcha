import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Header, Item, Label, Loader, Rating } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import NotFound from '../../app/layout/NotFound';
import { IPublicProfile } from '../../app/models/profile';
import BlockProfile from './BlockProfile';
import ProfileImagesDisplay from './ProfileImagesDisplay';
import ProfileVisitInterests from './ProfileVisitInterests';
import ProfileVisitLikeButton from './ProfileVisitLikeButton';
import ReportProfile from './ReportProfile';

interface IParams {
	id: string;
}

const ProfileVisit = () => {
	const [profile, setProfile] = useState<null | IPublicProfile>(null);
	const { id } = useParams<IParams>();
	const [error, setError] = useState(false);

	useEffect(() => {
		if (!profile) {
			agent.Profile.get(id)
				.then((p) => setProfile(p))
				.catch((error) => {
					console.log(error);
					setError(true);
				});
		}
	});

	if (error) return <NotFound />;

	if (!profile) return <Loader active />;

	return (
		<Fragment>
			<Item.Group divided>
				<Item>
					<Item.Image
						size="small"
						rounded
						src={
							profile!.images.length === 0
								? '/placeholder.png'
								: profile!.images
										.filter((image) => image.isMain)
										.map((im) => im.url)
						}
					/>
					<Item.Content>
						<Item.Header>
							{profile!.firstName} {profile!.lastName}, {profile!.age}
							{profile!.connected && (
									<Label color="pink" horizontal style={{marginLeft: 10}}>
										Matched
									</Label>
							)}
						</Item.Header>
						<Item.Meta>
							<Item>Last seen: {profile!.lastSeen}</Item>
							<Item>Gender: {profile!.gender}</Item>
							<Item>Sexual Preference: {profile!.sexualPreference}</Item>
						</Item.Meta>
						<Item.Description>
							<Header sub color="pink">
								Famerate
							</Header>
							<Rating
								icon="heart"
								disabled
								rating={profile!.fameRating}
								maxRating={10}
							/>
						</Item.Description>
						<Item.Description>
							<Header sub color="pink">
								Biography
							</Header>
							<p>{profile!.biography}</p>
						</Item.Description>
						<Item.Description>
							<Header sub color="pink">
								Interests
							</Header>
						</Item.Description>
						<ProfileVisitInterests interests={profile!.interests} />
					</Item.Content>
				</Item>
				<ProfileVisitLikeButton profile={profile!} setProfile={setProfile} />
				<BlockProfile id={profile.id} blocked={profile.blocked} />
				<ReportProfile id={profile.id} />
				<ProfileImagesDisplay images={profile!.images} />
			</Item.Group>
		</Fragment>
	);
};

export default ProfileVisit;

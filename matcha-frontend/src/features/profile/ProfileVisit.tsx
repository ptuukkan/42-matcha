import { Fragment, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { Header, Item, Label, Loader, Rating } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { IPublicProfile } from '../../app/models/profile';
import ProfileVisitLikeButton from './ProfileVisitLikeButton';

interface IParams {
	id: string;
}

const ProfileVisit = () => {
	const [profile, setProfile] = useState<null | IPublicProfile>(null);
	const { id } = useParams<IParams>();
	const history = useHistory();

	useEffect(() => {
		if (!profile) {
			agent.Profile.get(id)
				.then((p) => setProfile(p))
				.catch((error) => {
					console.log(error);
					history.push('/notfound');
				});
		}
	});

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
							{profile!.firstName} {profile!.lastName}
							{profile!.connected && (
								<Label color="teal" horizontal style={{ float: 'right' }}>
									Connected
								</Label>
							)}
						</Item.Header>
						<Item.Meta>
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
						<Item.Extra>
							{profile &&
								profile.interests.map((interests) => (
									<Label key={interests}>{interests}</Label>
								))}
						</Item.Extra>
					</Item.Content>
				</Item>
				<ProfileVisitLikeButton profile={profile!} setProfile={setProfile} />
				{profile!.images.length > 1 && (
					<Item>
						{profile!.images
							.filter((img) => !img.isMain)
							.map((image, i) => (
								<Item.Image key={i} size="small" rounded src={image.url} />
							))}
					</Item>
				)}
			</Item.Group>
		</Fragment>
	);
};

export default ProfileVisit;

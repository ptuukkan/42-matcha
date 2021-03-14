import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
	Item,
	Button,
	Label,
	Icon,
	Menu,
	Rating,
	Loader,
} from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { IInterestOption } from '../../app/models/interest';
import { RootStoreContext } from '../../app/stores/rootStore';

const ProfilePage = () => {
	const [interests, setInterests] = useState<IInterestOption[]>([]);
	const [interestsLoading, setInterestsLoading] = useState(false);
	const rootStore = useContext(RootStoreContext);
	const { profile, getProfile } = rootStore.profileStore;

	useEffect(() => {
		if (!profile) {
			getProfile().catch((e) => console.log(e));
		}
		if (interests.length === 0) {
			setInterestsLoading(true);
			agent.Interests.get()
				.then((interests) => setInterests(interests))
				.catch((error) => console.log(error))
				.finally(() => setInterestsLoading(false));
		}
	}, [profile, getProfile, interests.length]);

	if (!profile || interestsLoading) return <Loader active />;

	return (
		<>
			<Item.Group divided>
				<Button floated="right" size="tiny" as={Link} primary to={'/profileForm'}>
							Edit profile
						</Button>
				<Button floated="right" size="tiny" as={Link} primary to={'#'}>
							Edit credentials
						</Button>
				<Item>
					<Item.Image
						size="small"
						rounded
						src={
							profile?.images.length === 0
								? '/placeholder.png'
								: profile?.images
										.filter((image) => image.isMain)
										.map((im) => im.url)
						}
					/>
					<Item.Content>
						<Item.Header>
							{profile?.firstName} {profile?.lastName}
						</Item.Header>
						<Item.Meta>
							<Item>Gender: {profile?.gender}</Item>
							<Item>Sexual Preference: {profile?.sexualPreference}</Item>
						</Item.Meta>
						<Item.Description>
							<p>Famerate</p>
							<Rating icon="heart" disabled defaultRating={7} maxRating={10} />
						</Item.Description>
						<Item.Description>Interests</Item.Description>
						<Item.Extra>
							{profile &&
								profile.interests.map((interests) => (
									<Label key={interests}>{interests}</Label>
								))}
						</Item.Extra>
					</Item.Content>
				</Item>
				<Menu compact size="tiny">
					<Menu.Item as="a">
						<Icon name="heart" /> Likes
						<Label color="red" floating>
							22
						</Label>
					</Menu.Item>
					<Menu.Item as="a">
						<Icon name="users" /> Visits
						<Label color="teal" floating>
							22
						</Label>
					</Menu.Item>
				</Menu>
			</Item.Group>
		</>
	);
};

export default ProfilePage;

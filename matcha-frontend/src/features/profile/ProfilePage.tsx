import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
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
import { RootStoreContext } from '../../app/stores/rootStore';
import ChangeCredentials from '../user/ChangeCredentials';
import ProfileForm from './ProfileForm';

const ProfilePage = () => {
	const rootStore = useContext(RootStoreContext);
	const { profile, getProfile, updateProfile } = rootStore.profileStore;
	const { openModal } = rootStore.modalStore;

	useEffect(() => {
		if (!profile) {
			getProfile().catch((e) => console.log(e));
		}
	}, [profile, getProfile]);

	if (!profile) return <Loader active />;

	return (
		<>
			<Item.Group divided>
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
				<Button
					floated="right"
					size="tiny"
					primary
					content="Edit profile"
					onClick={() =>
						openModal(
							<ProfileForm profile={profile} updateProfile={updateProfile} />, "large"
						)
					}
				/>
				<Button
					floated="right"
					size="tiny"
					content="Edit credentials"
					onClick={() =>
						openModal(
							<ChangeCredentials />, "large"
						)
					}
				/>
			</Item.Group>
		</>
	);
};

export default observer(ProfilePage);

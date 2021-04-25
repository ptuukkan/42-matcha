import { observer } from 'mobx-react-lite';
import { Fragment, useContext } from 'react';
import {
	Item,
	Button,
	Label,
	Icon,
	Menu,
	Rating,
	Header,
} from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import ChangeCredentials from '../user/ChangeCredentials';
import ProfileForm from './ProfileForm';
import ProfileImagesDisplay from './ProfileImagesDisplay';
import ProfileStatistics from './ProfileStatistics';

const ProfilePage = () => {
	const rootStore = useContext(RootStoreContext);
	const { profile, updateProfile } = rootStore.profileStore;
	const { openModal, closeModal } = rootStore.modalStore;

	return (
		<Fragment>
			<Item.Group divided>
				<Item>
					<Item.Image
						size="small"
						rounded
						src={
							profile!.images.length === 0
								? '/placeholder_gradient.png'
								: profile!.images
										.filter((image) => image.isMain)
										.map((im) => im.url)
						}
					/>
					<Item.Content>
						<Item.Header>
							{profile!.firstName} {profile!.lastName}
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
								profile.interests.map((v, i) => (
									<Label color="pink" key={i} content={v} />
								))}
						</Item.Extra>
					</Item.Content>
				</Item>
				<Menu compact size="tiny">
					<Menu.Item
						onClick={() =>
							openModal(
								<ProfileStatistics
									profileThumbnails={profile!.likes}
									title="Likes"
								/>
							)
						}
					>
						<Icon name="heart" /> Likes
						<Label color="red" floating>
							{profile!.likes.length}
						</Label>
					</Menu.Item>
					<Menu.Item
						onClick={() =>
							openModal(
								<ProfileStatistics
									profileThumbnails={profile!.visits}
									title="Visits"
								/>
							)
						}
					>
						<Icon name="users" /> Visits
						<Label color="teal" floating>
							{profile!.visits.length}
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
							<ProfileForm
								profile={profile!}
								updateProfile={updateProfile}
								closeModal={closeModal}
							/>,
							'large'
						)
					}
				/>
				<Button
					floated="right"
					size="tiny"
					content="Edit credentials"
					onClick={() => openModal(<ChangeCredentials />)}
				/>
				<ProfileImagesDisplay images={profile!.images} />
			</Item.Group>
		</Fragment>
	);
};

export default observer(ProfilePage);

import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
	Item,
	Button,
	Label,
	Icon,
	Menu,
	Rating,
	Loader,
	Header,
	Image,
	Card,
} from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { IProfile } from '../../app/models/profile';
import { RootStoreContext } from '../../app/stores/rootStore';
import ChangeCredentials from '../user/ChangeCredentials';
import ProfileForm from './ProfileForm';
import ProfileStatistics from './ProfileStatistics';

const ProfilePage = () => {
	const rootStore = useContext(RootStoreContext);
	const { profile, getProfile, updateProfile } = rootStore.profileStore;
	const { openModal, closeModal } = rootStore.modalStore;

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
								? '/placeholder_gradient.png'
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
							<Header sub color="pink">
								Famerate
							</Header>
							<Rating
								icon="heart"
								disabled
								rating={profile.fameRating}
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
				<Menu compact size="tiny">
					<Menu.Item
						onClick={() =>
							openModal(
								<ProfileStatistics
									profileThumbnails={profile.likes}
									title="Likes"
								/>
							)
						}
					>
						<Icon name="heart" /> Likes
						<Label color="red" floating>
							{profile.likes.length}
						</Label>
					</Menu.Item>
					<Menu.Item
						onClick={() =>
							openModal(
								<ProfileStatistics
									profileThumbnails={profile.visits}
									title="Visits"
								/>
							)
						}
					>
						<Icon name="users" /> Visits
						<Label color="teal" floating>
							{profile.visits.length}
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
					onClick={() => openModal(<ChangeCredentials />, 'large')}
				/>
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
		</>
	);
};

export default observer(ProfilePage);

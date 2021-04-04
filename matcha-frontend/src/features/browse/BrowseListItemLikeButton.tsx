import { profile } from 'console';
import React, { useState } from 'react';
import { Button } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { IPublicProfile } from '../../app/models/profile';

interface IProps {
	profile: IPublicProfile;
	profiles: IPublicProfile[];
	setProfiles: React.Dispatch<React.SetStateAction<IPublicProfile[]>>;
}

const BrowseListItemLikeButton: React.FC<IProps> = ({
	profile,
	profiles,
	setProfiles,
}) => {
	const [loading, setLoading] = useState(false);

	const like = (p: IPublicProfile) => {
		setLoading(true);
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
			.catch((error) => console.log(error))
			.finally(() => setLoading(false));
	};

	const unlike = (p: IPublicProfile) => {
		setLoading(true);
		agent.Profile.unlike(p.id)
			.then(() => {
				let updatedProfile = { ...p, liked: false };
				setProfiles(
					profiles.map((profile) =>
						profile.id !== updatedProfile.id ? profile : updatedProfile
					)
				);
			})
			.catch((error) => console.log(error))
			.finally(() => setLoading(false));
	};
	return (
		<Button
			loading={loading}
			content={!profile.liked ? 'Like' : 'Unlike'}
			icon={!profile.liked ? 'like' : 'cancel'}
			floated="right"
			color={!profile.liked ? 'pink' : 'black'}
			onClick={!profile.liked ? () => like(profile) : () => unlike(profile)}
		/>
	);
};

export default BrowseListItemLikeButton;

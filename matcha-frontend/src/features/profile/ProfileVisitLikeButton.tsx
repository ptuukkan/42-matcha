import React, { useState } from 'react';
import { Button } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { IPublicProfile } from '../../app/models/profile';

interface IProps {
	profile: IPublicProfile;
	setProfile: React.Dispatch<React.SetStateAction<IPublicProfile | null>>;
}

const ProfileVisitLikeButton: React.FC<IProps> = ({ profile, setProfile }) => {
	const [liked, setLiked] = useState(profile.liked);
	const [loading, setLoading] = useState(false);

	const like = () => {
		setLoading(true);
		agent.Profile.like(profile.id)
			.then((res) => {
				if (res.connected) {
					setProfile({
						...profile,
						connected: true,
					});
				}
				setLiked(true);
			})
			.catch((error) => console.log(error))
			.finally(() => setLoading(false));
	};

	const unlike = () => {
		setLoading(true);
		agent.Profile.unlike(profile.id)
			.then(() => {
				setLiked(false);
				if (profile.connected) {
					setProfile({
						...profile,
						connected: false,
					});
				}
			})
			.catch((error) => console.log(error))
			.finally(() => setLoading(false));
	};

	if (liked) {
		return (
			<Button
				basic
				color="pink"
				content="Unlike"
				onClick={unlike}
				loading={loading}
			/>
		);
	} else {
		return (
			<Button color="pink" content="Like" onClick={like} loading={loading} />
		);
	}
};

export default ProfileVisitLikeButton;

import React, { useContext } from 'react';
import { Item, Label } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';

interface IProps {
	interests: string[];
}

const ProfileVisitInterests: React.FC<IProps> = ({ interests }) => {
	const rootStore = useContext(RootStoreContext);
	const { profile } = rootStore.profileStore;

	return (
		<Item.Extra>
			{interests.map((v, i) => (
				<Label
					color="pink"
					key={i}
					content={v}
					basic={!profile!.interests.includes(v)}
				/>
			))}
		</Item.Extra>
	);
};

export default ProfileVisitInterests;

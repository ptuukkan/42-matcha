import React, { Fragment, useContext } from 'react';
import { Header, Label } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';

interface IProps {
	interests: string[];
}

const BrowseListItemInterests: React.FC<IProps> = ({ interests }) => {
	const rootStore = useContext(RootStoreContext);
	const { profile } = rootStore.profileStore;
	const mutualInterests = interests.filter((i) =>
		profile!.interests.includes(i)
	);

	if (mutualInterests.length === 0) return <Fragment></Fragment>;

	return (
		<Fragment>
			<Header sub color="pink" content="Mutual Interests" />
			{mutualInterests.map((v, i) => (
				<Label color="pink" key={i}>
					{v}
				</Label>
			))}
		</Fragment>
	);
};

export default BrowseListItemInterests;

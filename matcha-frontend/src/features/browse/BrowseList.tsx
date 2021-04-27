import React, { Fragment } from 'react';
import { Header, Icon } from 'semantic-ui-react';
import { IPublicProfile } from '../../app/models/profile';
import BrowseListItem from './BrowseListItem';

interface IProps {
	profiles: IPublicProfile[];
	setProfiles: React.Dispatch<React.SetStateAction<IPublicProfile[]>>;
}

const BrowseList: React.FC<IProps> = ({ setProfiles, profiles }) => {

	if (profiles.length === 0) return (
		<div className="notfound">
		<Header icon>
			<Icon name="search" />
			No matches here!
		</Header>
		</div>
	)

	return (
		<Fragment>
			{profiles.map((p) => (
				<BrowseListItem
					key={p.id}
					profile={p}
					profiles={profiles}
					setProfiles={setProfiles}
				/>
			))}
		</Fragment>
	);
};

export default BrowseList;

import React, { Fragment } from 'react';
import { IPublicProfile } from '../../app/models/profile';
import BrowseListItem from './BrowseListItem';

interface IProps {
	profiles: IPublicProfile[];
	setProfiles: React.Dispatch<React.SetStateAction<IPublicProfile[]>>;
}

const BrowseList: React.FC<IProps> = ({ setProfiles, profiles }) => {
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

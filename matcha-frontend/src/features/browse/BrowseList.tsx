import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
	Image,
	Button,
	Card,
	Header,
	Icon,
	Rating,
	Label,
} from 'semantic-ui-react';
import agent from '../../app/api/agent';
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
				<BrowseListItem key={p.id} profile={p} profiles={profiles} setProfiles={setProfiles}  />
			))}
		</Fragment>
	);
};

export default BrowseList;

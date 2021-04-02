import React, { useState, useEffect, Fragment } from 'react';
import './browse.css';
import { Grid, Loader, Rail, Segment } from 'semantic-ui-react';
import { IPublicProfile } from '../../app/models/profile';
import agent from '../../app/api/agent';
import BrowseList from './BrowseList';
import BrowseListSorter from './BrowseListSorter';
import BrowseListFilter from './BrowseListFilter';


const Browse = () => {
	const [profiles, setProfiles] = useState<IPublicProfile[]>([]);
	const [ages, setAges] = useState<Number[]>([18, 100]);
	const [loading, setLoading] = useState(false);
	

	useEffect(() => {
		setLoading(true);
		agent.Browse.list()
			.then((profileList) => {
				let profiles = [...profileList.filter(p => !p.liked)]
				setProfiles(profiles);
			})
			.catch((error) => console.log(error))
			.finally(() => setLoading(false));
	}, []);

	if (loading) return <Loader active />;

	return (
		<Grid centered>
			<Grid.Column width={10}>
				<Rail position="left">
					<BrowseListSorter profiles={profiles} setProfiles={setProfiles} />
					<BrowseListFilter setAges={setAges} />
				</Rail>
				<BrowseList
					profiles={profiles.filter(
						(p) => p.age > ages![0] && p.age < ages![1]
					)} setProfiles={setProfiles} 
				/>
			</Grid.Column>
		</Grid>
	);
};

export default Browse;

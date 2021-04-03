import React, { useState, useEffect, Fragment, useContext } from 'react';
import './browse.css';
import { Grid, Loader, Rail, Segment } from 'semantic-ui-react';
import { IPublicProfile } from '../../app/models/profile';
import agent from '../../app/api/agent';
import BrowseList from './BrowseList';
import BrowseListSorter from './BrowseListSorter';
import BrowseListFilter from './BrowseListFilter';
import { RootStoreContext } from '../../app/stores/rootStore';

const Browse = () => {
	const [profiles, setProfiles] = useState<IPublicProfile[]>([]);
	const [ages, setAges] = useState<Number[]>([18, 100]);
	const [radius, setRadius] = useState<Number[]>([0, 1000]);
	const [famerate, setFamerate] = useState<Number[]>([0, 10]);
	const [commonInterests, setcommonInterests] = useState<Number[]>([0, 10]);
	const [loading, setLoading] = useState(false);
	const rootStore = useContext(RootStoreContext);
	const { profile, getProfile } = rootStore.profileStore;

	useEffect(() => {
		setLoading(true);
		if (!profile) {
			getProfile().catch((e) => console.log(e));
		}
		agent.Browse.list()
			.then((profileList) => {
				let profiles = [...profileList];
				profiles.forEach((element) => {
					element.commonInterests = element.interests.filter((interest) =>
						profile!.interests.includes(interest)
					).length;
				});
				setProfiles(profiles);
			})
			.catch((error) => console.log(error))
			.finally(() => setLoading(false));
	}, [profile, getProfile]);

	if (loading) return <Loader active />;

	return (
		<Grid centered>
			<Grid.Column width={10}>
				<Rail position="left">
					<BrowseListSorter profiles={profiles} setProfiles={setProfiles} />
					<BrowseListFilter
						setValue={setAges}
						minValue={18}
						maxValue={100}
						name={'Age'}
					/>
					<BrowseListFilter
						setValue={setRadius}
						minValue={0}
						maxValue={1000}
						name={'Radius'}
					/>
					<BrowseListFilter
						setValue={setcommonInterests}
						minValue={0}
						maxValue={10}
						name={'Common interests'}
					/>
					<BrowseListFilter
						setValue={setFamerate}
						minValue={0}
						maxValue={10}
						name={'Famerate'}
					/>
				</Rail>
				<BrowseList
					profiles={profiles.filter(
						(p) =>
							p.age > ages![0] &&
							p.age < ages![1] &&
							p.distance > radius[0] &&
							p.distance < radius[1] &&
							p.fameRating > famerate[0] &&
							p.fameRating < famerate[1] &&
							p.commonInterests > commonInterests[0] &&
							p.commonInterests < commonInterests[1]
					)}
					setProfiles={setProfiles}
				/>
			</Grid.Column>
		</Grid>
	);
};

export default Browse;

import { Link } from 'react-router-dom';
import {
	Card,
	Image,
	Header,
	Grid,
	Loader,
	Sidebar,
	Menu,
	Segment,
	Button,
	Rating,
} from 'semantic-ui-react';
import React, { useState, useEffect, useContext } from 'react';
import { IPublicProfile } from '../../app/models/profile';
import agent from '../../app/api/agent';
import { RootStoreContext } from '../../app/stores/rootStore';
import BrowseListSorter from '../browse/BrowseListSorter';
import BrowseListFilter from '../browse/BrowseListFilter';
import InterestsSorter from './InterestSorter';
import ResearchListItem from './ResearchListItem';

const Research = () => {
	const [profiles, setProfiles] = useState<IPublicProfile[]>([]);
	const [interests, setInterests] = useState<string[]>([]);
	const [ages, setAges] = useState<Number[]>([18, 100]);
	const [radius, setRadius] = useState<Number[]>([0, 1000]);
	const [famerate, setFamerate] = useState<Number[]>([0, 10]);
	const [commonInterests, setcommonInterests] = useState<Number[]>([0, 10]);
	const [showSideBar, setShowSideBar] = useState(false);
	const [loading, setLoading] = useState(false);
	const rootStore = useContext(RootStoreContext);
	const { profile } = rootStore.profileStore;

	useEffect(() => {
		setLoading(true);
		agent.Browse.list_all()
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
	}, [profile]);

	if (loading) return <Loader active />;

	console.log(interests);
	return (
		<Grid columns={1}>
			<Grid.Column>
				<Button onClick={() => setShowSideBar(true)}>Sort / Filter</Button>
				<Sidebar.Pushable as={Segment}>
					<Sidebar
						as={Menu}
						animation="overlay"
						icon="labeled"
						onHide={() => setShowSideBar(false)}
						vertical
						visible={showSideBar}
						width="wide"
					>
						<BrowseListSorter profiles={profiles} setProfiles={setProfiles} />
						<Header>Filter</Header>
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
						<InterestsSorter setValue={setInterests} />
					</Sidebar>

					<Sidebar.Pusher>
						<Segment basic>
							<Card.Group itemsPerRow={4}>
								{profiles
									.filter(
										(p) =>
											p.age >= ages[0] &&
											p.age <= ages[1] &&
											p.distance >= radius[0] &&
											p.distance <= radius[1] &&
											p.fameRating >= famerate[0] &&
											p.fameRating <= famerate[1] &&
											p.commonInterests >= commonInterests[0] &&
											p.commonInterests <= commonInterests[1]
									)
									.map((profile, i) => (
										<ResearchListItem profile={profile} key={i} />
									))}
							</Card.Group>
						</Segment>
					</Sidebar.Pusher>
				</Sidebar.Pushable>
			</Grid.Column>
		</Grid>
	);
};

export default Research;

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
import { IInterestOption } from '../../app/models/interest';

const Research = () => {
	const [profiles, setProfiles] = useState<IPublicProfile[]>([]);
	const [interests, setInterests] = useState<IInterestOption[]>([]);
	const [interestList, setInterestList] = useState<string[]>([]);
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
				setProfiles(profiles);
			})
			.catch((error) => console.log(error))
			.finally(() => setLoading(false));
		if (interests.length === 0) {
			agent.Interests.get()
				.then((interests) => setInterests(interests))
				.catch((error) => console.log(error));
		}
	}, [profile, interests.length]);

	if (loading) return <Loader active />;

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
						<InterestsSorter setValue={setInterestList} interests={interests} />
					</Sidebar>

					<Sidebar.Pusher>
						<Segment basic>
							<Card.Group itemsPerRow={3} stackable>
								{profiles
									.filter(
										(p) =>
											p.age >= ages[0] &&
											p.age <= ages[1] &&
											p.distance >= radius[0] &&
											p.distance <= radius[1] &&
											p.fameRating >= famerate[0] &&
											p.fameRating <= famerate[1] &&
											p.mutualInterests >= commonInterests[0] &&
											p.mutualInterests <= commonInterests[1] &&
											(interestList.length === 0
												? p
												: p.interests.find((x) => interestList.includes(x)))
									)
									.map((profile) => (
										<Card
											key={profile.id}
											as={Link}
											to={`/profile/${profile.id}`}
										>
											<Image
												src={profile.images.find((i) => i.isMain)?.url}
												wrapped
												ui={false}
											/>
											<Card.Content>
												<Header as="h5">
													{profile.firstName} {profile.lastName}
												</Header>
												Distance: {profile.distance} km
												<Card.Meta>
													<Rating
														icon="heart"
														disabled
														rating={profile.fameRating}
														maxRating={10}
														size="tiny"
													/>
												</Card.Meta>
											</Card.Content>
										</Card>
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

import React, { Fragment, useState } from 'react';
import {
	Button,
	Sidebar,
	Segment,
	Menu,
	Header,
	Card,
} from 'semantic-ui-react';
import { IPublicProfile } from '../../app/models/profile';
import BrowseListFilter from '../browse/BrowseListFilter';
import BrowseListSorter from '../browse/BrowseListSorter';
import ResearchListItem from './ResearchListItem';

interface IProps {
	profiles: IPublicProfile[];
	setProfiles: React.Dispatch<React.SetStateAction<IPublicProfile[]>>;
	setSearchMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResearchList: React.FC<IProps> = ({
	profiles,
	setProfiles,
	setSearchMode,
}) => {
	const [ages, setAges] = useState<Number[]>([18, 100]);
	const [radius, setRadius] = useState<Number[]>([0, 1000]);
	const [famerate, setFamerate] = useState<Number[]>([0, 10]);
	const [mutualInterests, setMutualInterests] = useState<Number[]>([0, 10]);
	const [showSideBar, setShowSideBar] = useState(false);

	return (
		<Fragment>
			<Button onClick={() => setShowSideBar(true)}>Sort / Filter</Button>
			<Button floated="right" color="pink" onClick={() => setSearchMode(true)}>
				Back to Search
			</Button>
			<Sidebar.Pushable as={Segment}>
				<Sidebar
					as={Menu}
					animation="overlay"
					icon="labeled"
					onHide={() => setShowSideBar(false)}
					vertical
					visible={showSideBar}
					width="wide"
					style={{padding: 40}}
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
						setValue={setMutualInterests}
						minValue={0}
						maxValue={10}
						name={'Mutual interests'}
					/>
					<BrowseListFilter
						setValue={setFamerate}
						minValue={0}
						maxValue={10}
						name={'Famerate'}
					/>
				</Sidebar>

				<Sidebar.Pusher>
					<Segment style={{ minHeight: 750 }} basic>
						<Card.Group itemsPerRow={4}>
							{/* {profiles.map((profile, i) => (
								<ResearchListItem profile={profile} key={i} />
							))} */}
							{profiles
								.filter(
									(p) =>
										p.age >= ages[0] &&
										p.age <= ages[1] &&
										p.distance >= radius[0] &&
										p.distance <= radius[1] &&
										p.fameRating >= famerate[0] &&
										p.fameRating <= famerate[1] &&
										p.mutualInterests >= mutualInterests[0] &&
										p.mutualInterests <= mutualInterests[1]
								)
								.map((profile, i) => (
									<ResearchListItem profile={profile} key={i} />
								))}
						</Card.Group>
					</Segment>
				</Sidebar.Pusher>
			</Sidebar.Pushable>
		</Fragment>
	);
};

export default ResearchList;

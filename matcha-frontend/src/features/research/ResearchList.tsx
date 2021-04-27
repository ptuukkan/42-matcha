import React, { Fragment, useState } from 'react';
import {
	Button,
	Sidebar,
	Segment,
	Menu,
	Header,
	Grid,
	Icon,
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
	const [radius, setRadius] = useState<Number[]>([0, 20000]);
	const [famerate, setFamerate] = useState<Number[]>([0, 10]);
	const [mutualInterests, setMutualInterests] = useState<Number[]>([0, 10]);
	const [showSideBar, setShowSideBar] = useState(false);

	const filterProfiles = () => {
		return profiles.filter(
			(p) =>
				p.age >= ages[0] &&
				p.age <= ages[1] &&
				p.distance >= radius[0] &&
				p.distance <= radius[1] &&
				p.fameRating >= famerate[0] &&
				p.fameRating <= famerate[1] &&
				p.mutualInterests >= mutualInterests[0] &&
				p.mutualInterests <= mutualInterests[1]
		);
	};

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
					style={{ padding: 40 }}
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
						maxValue={20000}
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
					<Segment style={{ minHeight: "60vh" }} basic>
						{filterProfiles().length === 0 && (
							<div className="notfound">
								<Header icon>
									<Icon name="search" />
									No matches here!
								</Header>
							</div>
						)}
						<Grid stackable divided="vertically">
							<Grid.Row columns="3">
								{filterProfiles().length > 0 &&
									filterProfiles().map((profile, i) => (
										<ResearchListItem profile={profile} key={i} />
									))}
							</Grid.Row>
						</Grid>
					</Segment>
				</Sidebar.Pusher>
			</Sidebar.Pushable>
		</Fragment>
	);
};

export default ResearchList;

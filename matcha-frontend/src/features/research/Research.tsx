import { Dimmer, Grid, Loader } from 'semantic-ui-react';
import { useState, useEffect } from 'react';
import { IPublicProfile } from '../../app/models/profile';
import ResearchForm from './ResearchForm';
import ResearchList from './ResearchList';
import { IInterestOption } from '../../app/models/interest';
import agent from '../../app/api/agent';
import { FORM_ERROR } from 'final-form';
import { IResearchFormValues } from '../../app/models/research';


export const initialValues: IResearchFormValues = {
	age: [18, 100],
	fameRating: [0, 10],
	distance: [0, 1000],
	interests: [],
};

const Research = () => {
	const [searchMode, setSearchMode] = useState(true);
	const [searchParams, setSearchParams] = useState(initialValues);
	const [interests, setInterests] = useState<IInterestOption[]>([]);
	const [loading, setLoading] = useState(false);
	const [profiles, setProfiles] = useState<IPublicProfile[]>([]);

	useEffect(() => {
		if (interests.length === 0) {
			setLoading(true);
			agent.Interests.get()
				.then((interests) => {
					setInterests(interests);
				})
				.catch((error) => console.log(error))
				.finally(() => setLoading(false));
		}
	}, [interests.length]);

	const loadProfiles = async (params: IResearchFormValues) => {
		try {
			setSearchParams(params);
			const ps = await agent.Research.list(params);
			setProfiles(ps);
			setSearchMode(false);
		} catch (error) {
			return { [FORM_ERROR]: error.message };
		}
	}

	if (loading)
		return (
			<Dimmer active inverted>
				<Loader />
			</Dimmer>
		);

	return (
		<Grid centered>
			{searchMode ? (
				<Grid.Column width={4}>
						<ResearchForm interests={interests} loadProfiles={loadProfiles} searchParams={searchParams} />
				</Grid.Column>
			) : (
				<Grid.Column>
					<ResearchList profiles={profiles} setProfiles={setProfiles} setSearchMode={setSearchMode} />
				</Grid.Column>
			)}
		</Grid>
	);
};

export default Research;

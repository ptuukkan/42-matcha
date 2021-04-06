import { Dimmer, Grid, Loader, Segment } from 'semantic-ui-react';
import React, { useState, useContext, useEffect } from 'react';
import { IPublicProfile } from '../../app/models/profile';
import { RootStoreContext } from '../../app/stores/rootStore';
import ResearchForm from './ResearchForm';
import ResearchList from './ResearchList';
import { IInterestOption } from '../../app/models/interest';
import agent from '../../app/api/agent';
import { FORM_ERROR } from 'final-form';

const Research = () => {
	const [searchMode, setSearchMode] = useState(true);
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

	const loadProfiles = async (params: any) => {
		console.log(params);
		try {
			const ps = await agent.Research.list();
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
						<ResearchForm interests={interests} loadProfiles={loadProfiles} />
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

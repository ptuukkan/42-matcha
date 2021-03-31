import React, { useState, useEffect } from 'react';
import './browse.css';
import {
	Header,
	Image,
	Card,
	Button,
	Grid,
	Loader,
	Icon,
	Rating,
} from 'semantic-ui-react';
import { IPublicProfile } from '../../app/models/profile';
import agent from '../../app/api/agent';

const Browse = () => {
	const [profiles, setProfiles] = useState<IPublicProfile[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		agent.Browse.list()
			.then((profileList) => {
				setProfiles(profileList);
			})
			.catch((error) => console.log(error))
			.finally(() => setLoading(false));
	}, []);

	const sort = (sortBy: string, profileList: IPublicProfile[]) => {
		const newProfiles = [...profileList];
		switch (sortBy) {
			case 'distance':
				newProfiles.sort((a, b) => a.distance - b.distance);
				setProfiles(newProfiles);
				break;
			case 'age':
				newProfiles.sort((a, b) => a.age - b.age);
				setProfiles(newProfiles);
				break;
			case 'fameRate':
				newProfiles.sort((a, b) => a.fameRating - b.fameRating);
				setProfiles(newProfiles);
				break;
			default:
				break;
		}
	};

	if (loading) return <Loader active />;

	return (
		<Grid centered>
			<Grid.Column width={10}>
				<Button onClick={() => sort('age', profiles)}>Age</Button>
				<Button onClick={() => sort('distance', profiles)}>Distance</Button>
				<Button onClick={() => sort('fameRate', profiles)}>Famerate</Button>
				{profiles!.map((p) => (
					<Card fluid key={p.id}>
						<Image
							src={p.images.find((i) => i.isMain)?.url}
							wrapped
							ui={false}
						/>

						<div className="profileinfo">
							<Header as="h1">
								{`${p.firstName} ${p.lastName}, ${p.age}`}
							</Header>
							<Icon name={p.gender === 'Female' ? 'mars' : 'venus'} />
							Distance: {p.distance} km
							<Header>
								Famerate
							</Header>
							<Rating
								icon="heart"
								disabled
								rating={p.fameRating}
								maxRating={10}
							/>
							<Card.Description>{p.biography}</Card.Description>
							<br></br>
							<Button circular icon="cancel" size="massive" color="black" />
							<Button
								circular
								icon="like"
								floated="right"
								size="massive"
								color="red"
							/>
						</div>
					</Card>
				))}
			</Grid.Column>
		</Grid>
	);
};

export default Browse;

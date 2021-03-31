import React, { useState, useEffect } from 'react';
import './browse.css';
import { Header, Image, Card, Button, Grid, Loader } from 'semantic-ui-react';
import { IPublicProfile } from '../../app/models/profile';
import agent from '../../app/api/agent';

const Browse = () => {
	const [profiles, setProfiles] = useState<IPublicProfile[]>([]);
	const [location, setLocation] = useState({ lat: 0, lon: 0 });
	const [loading, setLoading] = useState(false);

	/* 	const birth = new Date(profile.birthday).getFullYear()
	//  */ const nyt = new Date().getFullYear();

	const getLocation = () => {
		navigator.geolocation.getCurrentPosition((position) => {
			console.log(position.coords.latitude);
			console.log(position.coords.longitude);
			setLocation({
				lat: position.coords.latitude,
				lon: position.coords.longitude,
			});
		});
	};

	useEffect(() => {
		setLoading(true);
		getLocation();
		agent.Browse.list()
			.then((profileList) => {
				setProfiles(profileList);
			})
			.catch((error) => console.log(error))
			.finally(() => setLoading(false));
	}, []);

	if (loading) return <Loader active />;

	// const getDistance = (
	// 	latA: number,
	// 	latB: number,
	// 	lonA: number,
	// 	lonB: number
	// ) => {
	// 	let dLat = ((latA - latB) * Math.PI) / 180.0;
	// 	let dLon = ((lonA - lonB) * Math.PI) / 180.0;

	// 	latA = (latA * Math.PI) / 180.0;
	// 	latB = (latB * Math.PI) / 180.0;

	// 	let a =
	// 		Math.pow(Math.sin(dLat / 2), 2) +
	// 		Math.pow(Math.sin(dLon / 2), 2) * Math.cos(latA) * Math.cos(latB);

	// 	let rad = 6371;
	// 	let c = Math.asin(Math.sqrt(a));

	// 	return rad * c;
	// };

	return (
		<Grid centered>
			<Grid.Column width={10}>
				{profiles!.map((p) => (
					<Card fluid key={p.id}>
						<Image
							src={p.images.find((i) => i.isMain)?.url}
							wrapped
							ui={false}
						/>

						<div className="profileinfo">
							<Card.Content>
								<Header as="h1" style={{marginBottom: 0}}>
									{`${p.firstName} ${p.lastName}, ${p.age}`}
								</Header>
								<Card.Meta>{p.distance} kms away</Card.Meta>
								<Card.Description style={{marginTop: 7}}>{p.biography}</Card.Description>
								<br />
								<Button circular icon="cancel" size="massive" color="black" />
								<Button
									circular
									icon="like"
									floated="right"
									size="massive"
									color="red"
								/>
							</Card.Content>
						</div>
					</Card>
				))}
			</Grid.Column>
		</Grid>
	);
};

export default Browse;

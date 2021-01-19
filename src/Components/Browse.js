import React from "react";
import { Container, Card, Image, Header } from "semantic-ui-react";

const Browse = ({ users }) => {
	console.log(users);
	return (
		<Container>
			<Card.Group itemsPerRow={3}>
				{users.map((user) => (
					<Card key={user.address.latitude - Date.now()}>
						<Image src={user.pictures[0]} wrapped ui={false} />
						<Header as="h5">
							{user.firstname} {user.lastname}
						</Header>
						<Card.Content>
							Distance: {Math.floor(Math.random() * 80)} km
						</Card.Content>
					</Card>
				))}
			</Card.Group>
		</Container>
	);
};

export default Browse;

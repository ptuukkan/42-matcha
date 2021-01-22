import React from 'react'
import { Container, Card, Image, Header, Label } from 'semantic-ui-react'

const Matches = ({ users }) => {
	return (
		<Container>
			<Card.Group itemsPerRow={1}>
				{users.map((user) => (
					<Card key={user.address.latitude - Date.now()}>
						<Label color={user.address.buildingNumber < "40" ? 'red' : 'green' } floating>
							{user.address.buildingNumber < "40" ? 'Offline' : 'Online' }
						</Label>
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
	)
}

export default Matches

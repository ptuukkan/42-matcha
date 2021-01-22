import React from 'react'
import { Container, Card, Image, Header, Label } from 'semantic-ui-react'
import { IUser } from '../../app/models/user'

interface IProps {
	users: IUser[];
}

const Matches: React.FC<IProps> = ({ users }) => {
	return (
		<Container>
			<Card.Group itemsPerRow={1}>
				{users.map((user) => (
					<Card key={user.location.latitude - Date.now()}>
						<Label color={Math.abs(Math.floor(user.location.latitude)) < 40 ? 'red' : 'green' } floating>
							{Math.abs(Math.floor(user.location.latitude)) < 40 ? 'Offline' : 'Online' }
						</Label>
						<Image src={`https://robohash.org/${user.firstName}`} wrapped ui={false} />
						<Header as="h5">
							{user.firstName} {user.lastName}
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

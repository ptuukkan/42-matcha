import React from 'react'
import { Container, Card, Image, Header } from 'semantic-ui-react'
import { IUser } from '../../app/models/user'

interface IProps {
	users: IUser[]
}

const Browse: React.FC<IProps> = ({ users }) => {
	return (
		<Container>
			<Card.Group itemsPerRow={3}>
				{users.map((user) => (
					<Card key={user.location.latitude - Date.now()}>
						<Image src={`https://robohash.org/${user.firstName}`} wrapped ui={false} />
						<Header as="h5">
							{user.firstName} {user.lastName}
						</Header>
						<Card.Content>
							Distance: {Math.floor(Math.random() * 80)} km
							<Card.Meta>
								Likes:{' '}
								{Math.abs(Math.floor(user.location.latitude))}
							</Card.Meta>
						</Card.Content>
					</Card>
				))}
			</Card.Group>
		</Container>
	)
}

export default Browse

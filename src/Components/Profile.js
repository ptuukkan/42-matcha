import React from 'react'
import '../Profile.css'
import { Header, Image, Card, Icon, Button } from 'semantic-ui-react'

const Profile = ({getProfile, user}) => {
	console.log(user)
	return(
		<div>
			<Card fluid>
				<Image src={user.pictures[0]} wrapped ui={false} />
				<Image src={user.pictures[1]} wrapped ui={false} />
				<Image src={user.pictures[2]} wrapped ui={false} />
				<div className="profileinfo">

					<Header as='h1'>{user.firstName} {user.lastName}</Header>
					<Icon name='mars'/>
					<Card.Meta>Joined in 2016</Card.Meta>

					<Card.Description>
						{user.biography}
					</Card.Description>

					<br></br>

					<Button circular icon='cancel' size='massive' color='black'/>
					<Button circular icon='like' floated='right' size='massive' color='red' onClick={getProfile}/>
				</div>
			</Card>
		</div>
	)
}

export default Profile
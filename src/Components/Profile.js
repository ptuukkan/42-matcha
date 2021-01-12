import React from 'react'
import '../Profile.css'
import { Header, Image, Card, Icon, Button } from 'semantic-ui-react'

const Profile = () => {
	const src = "https://react.semantic-ui.com/images/wireframe/image.png"
	return(
		<div>
			<Card fluid>
				<Image src='https://react.semantic-ui.com/images/avatar/large/daniel.jpg' wrapped ui={false} />
				<Image src='https://react.semantic-ui.com/images/avatar/large/daniel.jpg' wrapped ui={false} />
				<Image src='https://react.semantic-ui.com/images/avatar/large/daniel.jpg' wrapped ui={false} />
				<Image src='https://react.semantic-ui.com/images/avatar/large/daniel.jpg' wrapped ui={false} />
				<Image src='https://react.semantic-ui.com/images/avatar/large/daniel.jpg' wrapped ui={false} />
				<div className="profileinfo">

					<Header as='h1'>Daniel</Header>
					<Icon name='mars'/>
					<Card.Meta>Joined in 2016</Card.Meta>

					<Card.Description>
						Daniel is a comedian living in Nashville.
					</Card.Description>

					<br></br>

					<Button circular icon='cancel' size='massive' color='black'/>
					<Button circular icon='like' floated='right' size='massive' color='red'/>
				</div>
			</Card>
		</div>
	)
}

export default Profile
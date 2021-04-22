import React from 'react'
import { Container, Segment, Grid, Header } from 'semantic-ui-react'


const Footer = () => {
	return (
		<Segment inverted vertical>
		<Container>
		<Grid divided inverted stackable>
			<Grid.Row>
			<Grid.Column width={7}>
				<Header as='h4' inverted>
				Matcha
				</Header>
			</Grid.Column>
			</Grid.Row>
		</Grid>
		</Container>
		</Segment>
	)
}

export default Footer
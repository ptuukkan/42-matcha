import React from 'react'
import { Container, Card } from 'semantic-ui-react'


const Profiles = ({setProfile}) => {
	const src = "https://react.semantic-ui.com/images/wireframe/image.png"
	return(
		<Container>
			<Card.Group itemsPerRow={3}>
				<Card raised image={src} onClick={() => setProfile('Profile')} />
				<Card raised image={src} onClick={() => console.log('Clicked')} />
				<Card raised image={src} onClick={() => console.log('Clicked')} />
				<Card raised image={src} onClick={() => console.log('Clicked')} />
				<Card raised image={src} onClick={() => console.log('Clicked')} />
				<Card raised image={src} onClick={() => console.log('Clicked')} />
				<Card raised image={src} onClick={() => console.log('Clicked')} />
				<Card raised image={src} onClick={() => console.log('Clicked')} />
				<Card raised image={src} onClick={() => console.log('Clicked')} />
				<Card raised image={src} onClick={() => console.log('Clicked')} />
				<Card raised image={src} onClick={() => console.log('Clicked')} />
				<Card raised image={src} onClick={() => console.log('Clicked')} />
				<Card raised image={src} onClick={() => console.log('Clicked')} />
				<Card raised image={src} onClick={() => console.log('Clicked')} />
				<Card raised image={src} onClick={() => console.log('Clicked')} />
				<Card raised image={src} onClick={() => console.log('Clicked')} />
				<Card raised image={src} onClick={() => console.log('Clicked')} />
				<Card raised image={src} onClick={() => console.log('Clicked')} />
				<Card raised image={src} onClick={() => console.log('Clicked')} />
				<Card raised image={src} onClick={() => console.log('Clicked')} />
				<Card raised image={src} onClick={() => console.log('Clicked')} />
			</Card.Group>
		</Container>
	)
}

export default Profiles
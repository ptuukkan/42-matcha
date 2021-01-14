import React, {useState} from 'react'
import { Button, Header, Segment, Item, Divider, Form, Label, Image } from 'semantic-ui-react'


const Settings = () => {
	const [location, setLocation] = useState('')
	const [radius, setRadius] = useState(1)

	const getLocation = () => {
		navigator.geolocation.getCurrentPosition( (position) => {
			console.log(position.coords.latitude)
			console.log(position.coords.longitude)
			setLocation(`Latitude: ${position.coords.longitude} Longitude: ${position.coords.longitude}`)
		})
	}

	const handleRadius = (e) => {
		e.preventDefault()
		setRadius(e.target.value)
	}

	const submitForm = (e) => {
		e.preventDefault()
		console.log('Form')
	}

	return (
		<div>
			<Segment>
				<Header as='h2'>Settings</Header>
			<Segment>
				<Header as='h4'>Personal information</Header>
				<Form unstackable onSubmit={submitForm}>
					<Image centered onClick={()=> console.log('Change Profile photo')} src='https://randomuser.me/api/portraits/men/41.jpg' circular ></Image>
					<Form.Group widths='equal' inline>
						Firstname: <Form.Input fluid type='text'></Form.Input>
						Lastname: <Form.Input fluid type='text'></Form.Input>
						Gender:
						<Form.Input list='genders' placeholder='Gender'></Form.Input>
							<datalist id='genders'>
								<option value='Male'></option>
								<option value='Female'></option>
							</datalist>
						Biography:
						<Form.TextArea></Form.TextArea>
					</Form.Group>
					<Form.Group widths='equal'>
					Sexual preference:
						<Form.Input list='preferences' placeholder='Sexual preferences'></Form.Input>
							<datalist id='preferences'>
								<option value='Hetero'></option>
								<option value='Bi'></option>
								<option value='Gay'></option>
								<option value='Asexual'></option>
							</datalist>
							Interests:
						<Form.Input list='intrests' placeholder='intrests' />
							<datalist id='intrests'>
								<option value='Vegan'>#Vegan</option>
								<option value='ChineseVegan'>#ChineseVegan</option>
								<option value='DutchBeer'>#DutchBeer</option>
							</datalist>
						<Divider section />
						<Label as='a' color='red'>#Vegan</Label>
						<Label as='a' color='red'>#Piercing</Label>
						<Label as='a' color='red'>#Games</Label>
						<Label as='a' color='red'>#Alcohol</Label>
					</Form.Group>
				</Form>
			</Segment>
			<Segment>
				<Item.Group relaxed>
					<Item>
					<Item.Content verticalAlign='middle'>
						<Item.Header>Location settings</Item.Header>
						<Item.Description>{location}</Item.Description>
						<Form.Dropdown floated='right' placeholder='Location'></Form.Dropdown>
						<Item.Extra>
							<Button floated='right' onClick={getLocation}>Get Location</Button>
						</Item.Extra>
					</Item.Content>
					</Item>
					<Divider/>
					<Item>
						<Item.Header>Max radius: {radius} km</Item.Header>
						<input type='range' min={1} max={100} value={radius} onChange={handleRadius}></input>
					</Item>
				</Item.Group>
			</Segment>
			</Segment>
		</div>
	)
}

export default Settings
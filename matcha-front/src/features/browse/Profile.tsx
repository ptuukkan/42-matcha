import React, { useState, useEffect } from 'react'
import './Profile.css'
import { Header, Image, Card, Icon, Button } from 'semantic-ui-react'
import { Gender, IUser } from '../../app/models/user'

interface IProps {
	user: IUser
	getProfile(): void; 
}

const Profile: React.FC<IProps> = ({ getProfile, user }) => {
	console.log(user)

	const [location, setLocation] = useState({ lat: 0, lon: 0 })

	const birth = new Date(user.birthday).getFullYear()
	const nyt = new Date().getFullYear()

	const getLocation = () => {
		navigator.geolocation.getCurrentPosition((position) => {
			console.log(position.coords.latitude)
			console.log(position.coords.longitude)
			setLocation({
				lat: position.coords.latitude,
				lon: position.coords.longitude,
			})
		})
	}

	useEffect(() => {
		getLocation()
	}, [])

	const getDistance = (latA: number, latB: number, lonA: number, lonB: number) => {
		let dLat = ((latA - latB) * Math.PI) / 180.0
		let dLon = ((lonA - lonB) * Math.PI) / 180.0

		latA = (latA * Math.PI) / 180.0
		latB = (latB * Math.PI) / 180.0

		let a =
			Math.pow(Math.sin(dLat / 2), 2) +
			Math.pow(Math.sin(dLon / 2), 2) * Math.cos(latA) * Math.cos(latB)

		let rad = 6371
		let c = Math.asin(Math.sqrt(a))

		return rad * c
	}

	return (
		<div>
			<Card fluid>
				<Image src={`https://robohash.org/${user.firstName}1`} wrapped ui={false} />
				<Image src={`https://robohash.org/${user.firstName}2`} wrapped ui={false} />
				<Image src={`https://robohash.org/${user.firstName}3`} wrapped ui={false} />
				<div className="profileinfo">
					<Header as="h1">
						{user.firstName} {user.lastName}
					</Header>
					<Icon name={user.gender === Gender.Male ? 'mars' : 'venus'} />
					<Card.Meta>
						Distance:{' '}
						{getDistance(
							location.lat,
							user.location.latitude,
							location.lon,
							user.location.longitude
						)}{' '}
						km
					</Card.Meta>
					Age: {nyt - birth}
					<Card.Description>{user.biography}</Card.Description>
					<br></br>
					<Button
						circular
						icon="cancel"
						size="massive"
						color="black"
					/>
					<Button
						circular
						icon="like"
						floated="right"
						size="massive"
						color="red"
						onClick={getProfile}
					/>
				</div>
			</Card>
		</div>
	)
}

export default Profile

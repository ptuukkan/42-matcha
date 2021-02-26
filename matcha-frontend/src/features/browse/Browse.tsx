import React, { useState, useEffect } from 'react'
import './browse.css'
import { Header, Image, Card, Icon, Button } from 'semantic-ui-react'
import { IProfile } from '../../app/models/profile'

interface IProps {
	profile: IProfile
	getProfile(): void;
}

const Browse: React.FC<IProps> = ({ getProfile, profile }) => {

	const [location, setLocation] = useState({ lat: 0, lon: 0 })

	const birth = new Date(profile.birthday).getFullYear()
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
				<Image src={`https://robohash.org/${profile.firstName}1`} wrapped ui={false} />
				<Image src={`https://robohash.org/${profile.firstName}2`} wrapped ui={false} />
				<Image src={`https://robohash.org/${profile.firstName}3`} wrapped ui={false} />
				<div className="profileinfo">
					<Header as="h1">
						{profile.firstName} {profile.lastName}
					</Header>
					<Icon name={profile.gender === 'male' ? 'mars' : 'venus'} />
					<Card.Meta>
						Distance:{' '}
						{getDistance(
							location.lat,
							profile.location.latitude,
							location.lon,
							profile.location.longitude
						)}{' '}
						km
					</Card.Meta>
					Age: {nyt - birth}
					<Card.Description>{profile.biography}</Card.Description>
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

export default Browse

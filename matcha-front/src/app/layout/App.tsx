import React, { useState } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Navigation from '../../features/nav/Navigation'
import { Container } from 'semantic-ui-react'
import './App.style.css'
import Profiles from '../../testProfiles1.json'
import Chat from '../../features/chat/Chat'
import Settings from '../../features/profile/Settings'
import Profile from '../../features/browse/Profile'
import Browse from '../../features/browse/Browse'
import Matches from '../../features/matches/Matches'
import Footer from '../../features/nav/Footer'
import Login from '../../features/user/Login'
import Register from '../../features/user/Register'

const App = () => {
	const [profile, setProfile] = useState(Profiles.profiles[0])

	const getRandomUser = () => {
		let i = Math.floor(Math.random() * Profiles.profiles.length)
		setProfile(Profiles.profiles[i])
	}
	console.log(profile)

	return (
		<Container className="main_container">
			<Router>
				<Navigation />
				<Switch>
					<Route exact path="/chat">
						<Chat />
					</Route>
					<Route exact path="/settings">
 						<Settings/>
					</Route>
					<Route exact path="/profile">
						<Profile getProfile={getRandomUser} user={profile} />
					</Route>
					<Route exact path="/matches">
{/* 						<Matches users={Profiles.profiles} /> */}
					</Route>
					<Route exact path="/browse">
{/* 						<Browse users={Profiles.profiles} /> */}
					</Route>
					<Route exact path="/register">
						<Register />
					</Route>
					<Route exact path="/login">
						<Login />
					</Route>
				</Switch>
			</Router>
			<Footer />
		</Container>
	)
}

export default App

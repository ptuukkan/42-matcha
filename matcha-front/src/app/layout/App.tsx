import React, { useState } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Navigation from '../../features/nav/Navigation'
import { Container } from 'semantic-ui-react'
import './style.css'
import Profiles from '../../testProfiles1.json'
import Chat from '../../features/chat/Chat'
import Settings from '../../features/profile/Settings'
import Profile from '../../features/browse/Profile'
import Browse from '../../features/browse/Browse'
import Matches from '../../features/matches/Matches'
import Footer from '../../features/nav/Footer'
import Login from '../../features/user/Login'
import Register from '../../features/user/Register'
import Landing from '../../features/home/Landing'

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
					<Route exact path="/chat" component={Chat} />
					<Route exact path="/settings" component={Settings} />
					<Route exact path="/profile">
						<Profile getProfile={getRandomUser} user={profile} />
					</Route>
					<Route exact path="/matches">
						<Matches users={Profiles.profiles} />
					</Route>
					<Route exact path="/browse">
						<Browse users={Profiles.profiles} />
					</Route>
					<Route exact path="/register" component={Register} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/" component={Landing} />
				</Switch>
			</Router>
			<Footer />
		</Container>
	)
}

export default App

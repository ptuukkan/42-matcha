import React, { Fragment, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navigation from '../../features/nav/Navigation';
import { Container, Dimmer, Loader } from 'semantic-ui-react';
import Profiles from '../../testProfiles1.json';
import Chat from '../../features/chat/Chat';
import Profile from '../../features/profile/Profile';
import Browse from '../../features/browse/Browse';
import Research from '../../features/research/Research';
import Matches from '../../features/matches/Matches';
import Footer from '../../features/nav/Footer';
import Login from '../../features/user/Login';
import Register from '../../features/user/Register';
import Landing from '../../features/home/Landing';
import { RootStoreContext } from '../stores/rootStore';
import { observer } from 'mobx-react-lite';
import NotFound from './NotFound';
import EmailVerification from '../../features/user/EmailVerification';
import LandingNavigation from '../../features/home/LandingNavigation';
import ChangePassword from '../../features/user/ChangePassword';

const App = () => {
	const [profile, setProfile] = useState(Profiles.profiles[0]);
	const [appLoaded, setAppLoaded] = useState(false);
	const rootStore = useContext(RootStoreContext);
	const { token, getUser, logoutUser, user } = rootStore.userStore;

	const getRandomUser = () => {
		let i = Math.floor(Math.random() * Profiles.profiles.length);
		setProfile(Profiles.profiles[i]);
	};

	useEffect(() => {
		if (token) {
			getUser()
				.catch(() => logoutUser())
				.finally(() => setAppLoaded(true));
		} else {
			setAppLoaded(true);
		}
	}, [getUser, token, setAppLoaded, logoutUser]);

	const logout = () => {
		logoutUser();
	};

	if (!appLoaded)
		return (
			<Dimmer active inverted>
				<Loader />
			</Dimmer>
		);

	return user === null ? (
		<div
			style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}
		>
			<Container className="main_container">
				<Router>
					<LandingNavigation />
					<Switch>
						<Route path="/verify/:link" component={EmailVerification} />
						<Route exact path="/changePassword/:link" component={ChangePassword} />
						<Route component={Landing} />
					</Switch>
				</Router>
			</Container>
			<Footer />
		</div>
	) : (
		<div
			style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}
		>
			<Container className="main_container">
				<Router>
					<Fragment>
						<Navigation logout={logout} />
						<Switch>
							<Route exact path="/">
								<Browse getProfile={getRandomUser} profile={profile} />
							</Route>
							<Route exact path="/chat" component={Chat} />
							<Route exact path="/profile" component={Profile} />
							<Route exact path="/matches">
								<Matches profiles={Profiles.profiles} />
							</Route>
							<Route exact path="/research">
								<Research profiles={Profiles.profiles} />
							</Route>
							<Route exact path="/register" component={Register} />
							<Route exact path="/login" component={Login} />
							<Route component={NotFound} />
						</Switch>
					</Fragment>
				</Router>
			</Container>
			<Footer />
		</div>
	);
};

export default observer(App);

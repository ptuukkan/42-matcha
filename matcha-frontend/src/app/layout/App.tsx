import React, { Fragment, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navigation from '../../features/nav/Navigation';
import { Container } from 'semantic-ui-react';
import Profiles from '../../testProfiles1.json';
import Chat from '../../features/chat/Chat';
import Settings from '../../features/profile/Settings';
import Profile from '../../features/browse/Profile';
import Browse from '../../features/browse/Browse';
import Matches from '../../features/matches/Matches';
import Footer from '../../features/nav/Footer';
import Login from '../../features/user/Login';
import Register from '../../features/user/Register';
import Landing from '../../features/home/Landing';
import { RootStoreContext } from '../stores/rootStore';

const App = () => {
	const [profile, setProfile] = useState(Profiles.profiles[0]);
	const rootStore = useContext(RootStoreContext);
	const { token, getUser } = rootStore.userStore;

	const getRandomUser = () => {
		let i = Math.floor(Math.random() * Profiles.profiles.length);
		setProfile(Profiles.profiles[i]);
	};

	useEffect(() => {
		if (token) {
			getUser();
		}
	});

	return (
		<div
			style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}
		>
			<Container className="main_container">
				<Router>
					<Route exact path="/" component={Landing} />
					<Route
						path={'/(.+)'}
						render={() => (
							<Fragment>
								<Navigation />
								<Switch>
									<Route exact path="/chat" component={Chat} />
									<Route exact path="/settings" component={Settings} />
									<Route exact path="/profile">
										<Profile getProfile={getRandomUser} profile={profile} />
									</Route>
									<Route exact path="/matches">
										<Matches profiles={Profiles.profiles} />
									</Route>
									<Route exact path="/browse">
										<Browse profiles={Profiles.profiles} />
									</Route>
									<Route exact path="/register" component={Register} />
									<Route exact path="/login" component={Login} />
								</Switch>
							</Fragment>
						)}
					/>
				</Router>
			</Container>
			<Footer />
		</div>
	);
};

export default App;

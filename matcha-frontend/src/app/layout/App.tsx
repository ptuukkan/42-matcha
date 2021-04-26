import React, { Fragment, useContext, useEffect, useState } from 'react';
import {
	Switch,
	Route,
	RouteComponentProps,
	withRouter,
	Redirect,
} from 'react-router-dom';
import Navigation from '../../features/nav/Navigation';
import { Container, Dimmer, Loader } from 'semantic-ui-react';
import Chat from '../../features/chat/Chat';
import Footer from '../../features/nav/Footer';
import Landing from '../../features/home/Landing';
import { RootStoreContext } from '../stores/rootStore';
import { observer } from 'mobx-react-lite';
import NotFound from './NotFound';
import EmailVerification from '../../features/user/EmailVerification';
import ChangePassword from '../../features/user/ChangePassword';
import { ToastContainer } from 'react-toastify';
import ProfilePage from '../../features/profile/ProfilePage';
import ModalContainer from '../common/modals/ModalContainer';
import PrivateRoute from './PrivateRoute';
import SubModalContainer from '../common/modals/SubModalContainer';
import ProfileVisit from '../../features/profile/ProfileVisit';
import Browse from '../../features/browse/Browse';
import Research from '../../features/research/Research';
import Matches from '../../features/matches/Matches';
import MobileNotifications from '../../features/notifications/MobileNotifications';

const App: React.FC<RouteComponentProps> = ({ location }) => {
	const [appLoaded, setAppLoaded] = useState(false);
	const rootStore = useContext(RootStoreContext);
	const { token, getUser, logoutUser, user } = rootStore.userStore;

	useEffect(() => {
		document.title = 'Matcha';
		if (token) {
			getUser()
				.catch(() => logoutUser())
				.finally(() => setAppLoaded(true));
		} else {
			setAppLoaded(true);
		}
	}, [getUser, token, setAppLoaded, logoutUser]);

	if (!appLoaded)
		return (
			<Dimmer active inverted>
				<Loader />
			</Dimmer>
		);

	return (
		<div
			style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}
		>
			<Container
				className="main_container"
				style={{ paddinTop: 90, paddingBottom: 90 }}
			>
				<ToastContainer style={{ marginTop: '5%' }} position="top-right" />
				<ModalContainer />
				<SubModalContainer />
				<Navigation />
				<Switch>
					<Route path="/verify/:link" component={EmailVerification} />
					<Route path="/resetpassword/:link" component={ChangePassword} />
					<Route exact path="/" component={user ? Browse : Landing} />
					<Route
						render={() => (
							<Fragment>
								<Switch>
									<PrivateRoute path="/research" component={Research} />
									<PrivateRoute
										key={location.key}
										path="/profile/:id"
										component={ProfileVisit}
									/>
									<PrivateRoute path="/matches" component={Matches} />
									<Route exact path="/profile">
										{user ? <ProfilePage /> : <Redirect to={'/'} />}
									</Route>
									<PrivateRoute exact path="/chat" component={Chat} />
									<PrivateRoute
										exact
										path="/notifications"
										component={MobileNotifications}
									/>
									<PrivateRoute component={NotFound} />
								</Switch>
							</Fragment>
						)}
					/>
				</Switch>
			</Container>
			<Footer />
		</div>
	);
};

export default withRouter(observer(App));

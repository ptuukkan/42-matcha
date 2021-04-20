import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon, Label, Popup } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import Notifications from '../notifications/Notifications';

interface IProps {
	logoutUser: () => void;
}

const PrivateMenuItems: React.FC<IProps> = ({ logoutUser }) => {
	const rootStore = useContext(RootStoreContext);
	const { unreadNotificationsCount } = rootStore.profileStore;

	return (
		<Fragment>
			<Menu.Menu position="right">
				<Menu.Item as={Link} to="/matches" name="matches">
					<Icon name="fire"></Icon>
					Matches
				</Menu.Item>
				<Menu.Item as={Link} to="/research" name="research">
					<Icon name="users" />
					Research
				</Menu.Item>
				<Menu.Item as={Link} to="/profile" name="myprofile">
					<Icon name="user circle" />
					My Profile
				</Menu.Item>
				<Menu.Item as={Link} to="/chat" name="chat">
					<Icon name="comments" />
					Chat
				</Menu.Item>
				<Popup
					trigger={
						<Menu.Item name="notifications">
							{unreadNotificationsCount > 0 && (
								<Label
									circular
									color="red"
									size="mini"
									className="notificationBall"
									content={unreadNotificationsCount}
								/>
							)}
							<Icon name="bell" />
							Notifications
						</Menu.Item>
					}
					content={Notifications}
					position="bottom right"
					on="click"
					pinned
				/>

				<Menu.Item as={Link} to="/" name="logout" onClick={logoutUser}>
					<Icon name="times" />
					Logout
				</Menu.Item>
			</Menu.Menu>
		</Fragment>
	);
};

export default observer(PrivateMenuItems);

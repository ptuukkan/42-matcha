import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'semantic-ui-react';

interface IProps {
	logoutUser: () => void;
}

const PrivateMenuItems: React.FC<IProps> = ({ logoutUser }) => {
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
				<Menu.Item as={Link} to="/notifications" name="notifications">
					<Icon name="bell" />
					Notifications
				</Menu.Item>
				<Menu.Item as={Link} to="/" name="logout" onClick={logoutUser}>
					<Icon name="times" />
					Logout
				</Menu.Item>
			</Menu.Menu>
		</Fragment>
	);
};

export default PrivateMenuItems;

import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Label, Icon } from 'semantic-ui-react';

interface IProps {
	logoutUser: () => void;
}

const PrivateMenuItems: React.FC<IProps> = ({ logoutUser }) => {
	return (
		<Fragment>
			<Menu.Menu position="right">
				<Menu.Item as={Link} to="/matches" name="matches">
					<Label
						circular
						color="red"
						size="mini"
						className="notificationBall"
						content="12"
					/>
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
					<Label
						circular
						color="red"
						size="mini"
						className="notificationBall"
						content="2"
					/>
					<Icon name="comments" />
					Chat
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

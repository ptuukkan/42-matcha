import React from 'react';
import { Icon, Menu, Label, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

interface IProps {
	logout(): void;
}

const Navigation: React.FC<IProps> = ({ logout }) => {
	return (
		<Menu fixed="top" icon="labeled" size="mini" borderless className="navi">
			<Menu.Menu position="right">
				<Menu.Item as={Link} to="/" name="heart">
					<Image size="small" src="/logo.png" style={{ marginRight: '1.5em' }} />
					Browse
				</Menu.Item>
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
				<Menu.Item as={Link} to="/" name="logout" onClick={() => logout()}>
					<Icon name="times" />
					Logout
				</Menu.Item>
			</Menu.Menu>
		</Menu>
	);
};

export default Navigation;

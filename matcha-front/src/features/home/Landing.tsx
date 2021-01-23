import React, { Fragment } from 'react';
import { Button, Header, Menu } from 'semantic-ui-react';

const Landing = () => {
	return (
		<Fragment>
			<Menu fixed="top" icon="labeled" size="mini" borderless className="navi">
					<Menu.Item header style={{fontSize: 32, padding: 0}}>Matcha</Menu.Item>
					<Menu.Item position="right">
						<Button size="tiny" secondary content="Login" />
					</Menu.Item>
					<Menu.Item>
						<Button size='huge' secondary content="Register" />
					</Menu.Item>

			</Menu>
			<Header>Welcome to matcha</Header>
		</Fragment>
	);
};

export default Landing;

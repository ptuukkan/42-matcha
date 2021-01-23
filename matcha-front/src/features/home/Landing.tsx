import React, { Fragment, useState } from 'react';
import { Button, Header, Menu } from 'semantic-ui-react';
import Register from '../user/Register';

const Landing = () => {
	const [registerOpen, setRegisterOpen] = useState(false);

	const closeRegisterModal = () => {
		setRegisterOpen(false);
	};

	const openRegisterModal = () => {
		setRegisterOpen(true);
	};

	return (
		<Fragment>
			<Menu fixed="top" icon="labeled" size="mini" borderless className="navi">
				<Menu.Item header style={{ fontSize: 32, padding: 0 }}>
					Matcha
				</Menu.Item>
				<Menu.Item position="right">
					<Button size="tiny" secondary content="Login" />
				</Menu.Item>
				<Menu.Item>
					<Button
						size="huge"
						secondary
						content="Register"
						onClick={openRegisterModal}
					/>
				</Menu.Item>
			</Menu>
			<Header>Welcome to matcha</Header>
			<Register open={registerOpen} closeRegisterModal={closeRegisterModal} />
		</Fragment>
	);
};

export default Landing;

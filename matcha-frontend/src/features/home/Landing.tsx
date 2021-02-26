import React, { Fragment, useContext } from 'react';
import { Button, Header, Menu } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import Login from '../user/Login';
import Register from '../user/Register';

const Landing = () => {
	const rootStore = useContext(RootStoreContext);
	const { openRegister, openLogin } = rootStore.modalStore;

	return (
		<Fragment>
			<Menu fixed="top" icon="labeled" size="mini" borderless className="navi">
				<Menu.Item header style={{ fontSize: 32, padding: 0 }}>
					Matcha
				</Menu.Item>
				<Menu.Item position="right">
					<Button
						size="huge"
						secondary
						content="Login"
						onClick={openLogin}
					/>
				</Menu.Item>
				<Menu.Item>
					<Button
						size="huge"
						secondary
						content="Register"
						onClick={openRegister}
					/>
				</Menu.Item>
			</Menu>
			<Header>Welcome to matcha</Header>
			<Register />
			<Login />
		</Fragment>
	);
};

export default Landing;

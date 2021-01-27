import React, { Fragment, useContext, useState } from 'react';
import { Button, Header, Menu } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import Login from '../user/Login';
import Register from '../user/Register';

const Landing = () => {
	const rootStore = useContext(RootStoreContext);
	const { openRegisterModal, openLoginModal } = rootStore.modalStore;

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
						onClick={openLoginModal}
					/>
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
			<Register />
			<Login />
		</Fragment>
	);
};

export default Landing;

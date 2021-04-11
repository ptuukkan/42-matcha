import React, { Fragment } from 'react';
import { Menu, Button } from 'semantic-ui-react';
import Login from '../user/Login';
import Register from '../user/Register';

interface IProps {
	openModal: (content: any) => void;
}

const MenuItems: React.FC<IProps> = ({ openModal }) => {
	return (
		<Fragment>
			<Menu.Item position="right">
				<Button size="huge" secondary content="Login" onClick={() => openModal(<Login />)} />
			</Menu.Item>
			<Menu.Item>
				<Button
					size="huge"
					secondary
					content="Register"
					onClick={() => openModal(<Register />)}
				/>
			</Menu.Item>
		</Fragment>
	);
};

export default MenuItems;

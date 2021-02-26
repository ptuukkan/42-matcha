import { useContext } from 'react';
import { Button, Menu } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import Login from '../user/Login';
import Register from '../user/Register';


const LandingNavigation = () => {
	const rootStore = useContext(RootStoreContext);
	const { openRegister, openLogin } = rootStore.modalStore;
	
	return (
		<>
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
			<Login />
			<Register />
		</>
	)
}

export default LandingNavigation
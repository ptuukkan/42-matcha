import { useContext } from 'react';
import { toast } from 'react-toastify';
import { Button, Menu, Image } from 'semantic-ui-react';
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
					<Image size="small" src="/logo.png" style={{ marginRight: '1.5em' }} />
				</Menu.Item>
				<Menu.Item position="right">
					<Button size="huge" secondary content="Login" onClick={openLogin} />
				</Menu.Item>
				<Menu.Item>
					<Button
						size="huge"
						secondary
						content="Register"
						onClick={openRegister}
					/>
				</Menu.Item>
				<Menu.Item>
					<Button
						size="huge"
						secondary
						content="Toaster"
						onClick={() => toast.info('This is a test')}
					/>
				</Menu.Item>
			</Menu>
			<Login />
			<Register />
		</>
	);
};

export default LandingNavigation;

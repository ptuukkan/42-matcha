import { useContext } from 'react';
import { Menu, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import PrivateMenuItems from './PrivateMenuItems';
import MenuItems from './MenuItems';

const Navigation = () => {
	const rootStore = useContext(RootStoreContext);
	const { user, logoutUser } = rootStore.userStore;
	const { openModal } = rootStore.modalStore;

	return (
		<Menu fixed="top" icon="labeled" size="mini" borderless className="navi">
			<Menu.Item as={Link} to="/">
				<Image
					size="small"
					src="/logo.png"
					floated="left"
					style={{ marginRight: '1.5em' }}
				/>
			</Menu.Item>
			{user ? (
				<PrivateMenuItems logoutUser={logoutUser} />
			) : (
				<MenuItems openModal={openModal} />
			)}
		</Menu>
	);
};

export default Navigation;

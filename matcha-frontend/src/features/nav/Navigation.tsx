import { useContext } from 'react';
import { Menu, Image, Grid, GridColumn } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import PrivateMenuItems from './PrivateMenuItems';
import MenuItems from './MenuItems';

const Navigation = () => {
	const rootStore = useContext(RootStoreContext);
	const { user, logoutUser } = rootStore.userStore;
	const { openModal } = rootStore.modalStore;

	return (
		<Grid columns="2" doubling stackable>
			<Menu fixed="top" icon="labeled" compact size="mini" borderless>
				<GridColumn>
					<Menu.Item as={Link} to="/">
						<Image
							size="small"
							src={'/logo.png'}
							floated="left"
							style={{ marginRight: '1em' }}
						/>
					</Menu.Item>
				</GridColumn>
				<GridColumn floated="right">
					{user ? (
						<PrivateMenuItems logoutUser={logoutUser} />
					) : (
						<MenuItems openModal={openModal} />
					)}
				</GridColumn>
			</Menu>
		</Grid>
	);
};

export default Navigation;

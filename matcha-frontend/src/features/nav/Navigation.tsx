import { Fragment, useContext } from 'react';
import { Menu, Image, Grid, GridColumn } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import PrivateMenuItems from './PrivateMenuItems';
import MenuItems from './MenuItems';
import { AppMedia } from '../../app/layout/AppMedia';
import MobileMenu from './MobileMenu';

const Navigation = () => {
	const rootStore = useContext(RootStoreContext);
	const { user, logoutUser } = rootStore.userStore;
	const { openModal } = rootStore.modalStore;
	const { Media, MediaContextProvider } = AppMedia;

	return (
		<MediaContextProvider>
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
							<Fragment>
								<Media at="xs">
									<MobileMenu logoutUser={logoutUser} />
								</Media>
								<Media greaterThanOrEqual="sm">
									<PrivateMenuItems logoutUser={logoutUser} />
								</Media>
							</Fragment>
						) : (
							<MenuItems openModal={openModal} />
						)}
					</GridColumn>
				</Menu>
			</Grid>
		</MediaContextProvider>
	);
};

export default Navigation;

import { observer } from 'mobx-react-lite';
import { useContext, useEffect } from 'react';
import { List } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import NotificationsList from './NotificationsList';

const MobileNotifications = () => {
	const rootStore = useContext(RootStoreContext);
	const {
		notifications,
		readNotifications,
		clearNotifications,
		unreadNotifications,
	} = rootStore.profileStore;

	useEffect(() => {
		setTimeout(() => {
			readNotifications(unreadNotifications);
		}, 5000);
	});

	return (
		<List
			divided
			verticalAlign="middle"
			relaxed
			style={{ maxHeight: '70vh', overflow: 'auto', minWidth: 300 }}
		>
			{notifications.length > 0 ? (
				<NotificationsList
					notifications={notifications}
					clearNotifications={clearNotifications}
				/>
			) : (
				<List.Item>
					<List.Description>No notifications</List.Description>
				</List.Item>
			)}
		</List>
	);
};

export default observer(MobileNotifications);

import { observer } from 'mobx-react-lite';
import { useContext, useEffect } from 'react';
import { List } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import NotificationsList from './NotificationsList';

const Notifications = () => {
	const rootStore = useContext(RootStoreContext);
	const {
		notifications,
		readNotifications,
		clearNotifications,
	} = rootStore.profileStore;

	useEffect(() => {
		readNotifications();
	});

	return (
		<List
			divided
			verticalAlign="middle"
			relaxed
			style={{ maxHeight: '50vh', overflow: 'auto', minWidth: 250 }}
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

export default observer(Notifications);

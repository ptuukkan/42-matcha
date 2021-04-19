import { useContext } from 'react';
import { List, Image } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';

const NotificationsList = () => {
	const rootStore = useContext(RootStoreContext);
	const { notifications } = rootStore.profileStore;

	return (
		<List>
			{notifications.map((notification) => (
				<List.Item key={notification.id}>
					<Image avatar src={notification.profile.image.url} />
					<List.Content>
						<List.Header as="a" href={`/profile/${notification.profile.id}`}>
							{notification.profile.firstName}
						</List.Header>
						<List.Description>
							{`${notification.message} ${notification.sentAt}`}
						</List.Description>
					</List.Content>
				</List.Item>
			))}
		</List>
	);
};

export default NotificationsList;

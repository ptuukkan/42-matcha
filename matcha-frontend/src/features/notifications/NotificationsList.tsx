import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { List, Image, Grid, Label } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';

const NotificationsList = () => {
	const rootStore = useContext(RootStoreContext);
	const { notifications, readNotifications } = rootStore.profileStore;

	useEffect(() => {
			readNotifications();
	});

	return (
		<List
			divided
			verticalAlign="middle"
			relaxed
			style={{ maxHeight: '50vh', overflow: 'scroll', overflowX: 'hidden' }}
		>
			{notifications.map((notification) => (
				<List.Item key={notification.id}>
					<Image avatar src={notification.profile.image.url} />
					<List.Content>

						<List.Header as={Link} to={`/profile/${notification.profile.id}`}>
							{notification.profile.firstName}
							<Label color='pink' content="New" compact />
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

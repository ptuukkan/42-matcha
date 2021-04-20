import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { List, Label, Image, Button } from 'semantic-ui-react';
import { INotification } from '../../app/models/notification';
import formatDistance from 'date-fns/formatDistance';

interface IProps {
	notifications: INotification[];
	clearNotifications: () => Promise<void>;
}

const NotificationsList: React.FC<IProps> = ({
	notifications,
	clearNotifications,
}) => {
	return (
		<Fragment>
			<List.Item>
				<List.Content floated="right">
					<List.Description>
						<Button basic color="pink" compact onClick={clearNotifications}>
							Clear notifications
						</Button>
					</List.Description>
				</List.Content>
			</List.Item>
			{notifications.map((notification) => (
				<List.Item key={notification.id}>
					<Image avatar src={notification.profile.image.url} />
					<List.Content>
						<List.Header as={Link} to={`/profile/${notification.profile.id}`}>
							{notification.profile.firstName}
							{!notification.read && (
								<Label color="pink" content="New" style={{ padding: 3 }} />
							)}
						</List.Header>
						<List.Description>
							{`${notification.message} ${formatDistance(
								notification.timestamp,
								Date.now(),
								{ addSuffix: true }
							)}`}
						</List.Description>
					</List.Content>
				</List.Item>
			))}
		</Fragment>
	);
};

export default NotificationsList;

import { observer } from 'mobx-react-lite';
import { Fragment, useContext } from 'react';
import { Menu, Tab, Image, Label } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import ComputerChatPane from './ComputerChatPane';

const ComputerChat = () => {
	const rootStore = useContext(RootStoreContext);
	const { chats } = rootStore.chatStore;

	const panes = chats.map((chat, i) => ({
		menuItem: (
			<Menu.Item key={i}>
				<Image
					avatar
					src={chat.participant.image.url}
					style={{ marginRight: 10 }}
				/>
				{chat.participant.firstName}
				{chat.unread && (
					<Label
						empty
						circular
						color="red"
						size="mini"
						style={{ marginTop: 10 }}
					/>
				)}
			</Menu.Item>
		),
		render: () => (
			<Fragment>
				<ComputerChatPane chat={chat} />
			</Fragment>
		),
	}));

	return (
		<Tab
			style={{ marginTop: 20 }}
			menu={{ fluid: true, vertical: true }}
			menuPosition="left"
			panes={panes}
		/>
	);
};

export default observer(ComputerChat);

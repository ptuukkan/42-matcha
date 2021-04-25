import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Menu, Tab, Image, Label } from 'semantic-ui-react';
import { IChat } from '../../app/models/chat';
import { RootStoreContext } from '../../app/stores/rootStore';
import ComputerChatPane from './ComputerChatPane';

interface IProps {
	chats: IChat[];
}

const ComputerChat: React.FC<IProps> = ({ chats }) => {
	const rootStore = useContext(RootStoreContext);
	const { unreadMessages } = rootStore.chatStore;

	const panes = chats.map((chat, i) => ({
		menuItem: (
			<Menu.Item key={i}>
				<Image
					avatar
					src={chat.participant.image.url}
					style={{ marginRight: 10 }}
				/>
				{chat.participant.firstName}
				{unreadMessages.includes(chat.chatId) && (
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
			<div>
				<ComputerChatPane chat={chat} />
			</div>
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

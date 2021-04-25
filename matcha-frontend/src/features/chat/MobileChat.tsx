import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Divider, Dropdown, DropdownProps, Segment } from 'semantic-ui-react';
import { IChat } from '../../app/models/chat';
import { RootStoreContext } from '../../app/stores/rootStore';
import MobileChatPane from './MobileChatPane';

interface IProps {
	chats: IChat[];
}

const MobileChat: React.FC<IProps> = ({ chats }) => {
	const [selectedChat, setSelectedChat] = useState(chats[0]);
	const rootStore = useContext(RootStoreContext);
	const { unreadMessages } = rootStore.chatStore;

	const chatOptions = chats.map((chat) => ({
		key: chat.chatId,
		text: chat.participant.firstName,
		value: chat.chatId,
		image: { avatar: true, src: chat.participant.image.url },
		label: unreadMessages.includes(chat.chatId) && {
			color: 'red',
			empty: true,
			circular: true,
			size: 'mini',
		},
	}));

	const handleSelect = (
		_event: React.SyntheticEvent<HTMLElement, Event>,
		data: DropdownProps
	) => {
		if (data.value) {
			const chat = chats.find((c) => c.chatId === data.value);
			if (chat) {
				setSelectedChat(chat);
			}
		}
	};

	return (
		<Segment>
			<Dropdown
				inline
				onChange={handleSelect}
				defaultValue={chats[0].chatId}
				options={chatOptions}
			/>
			<Divider />
			<MobileChatPane chat={selectedChat} />
		</Segment>
	);
};

export default observer(MobileChat);

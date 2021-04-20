import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Dimmer, Loader, Menu, Tab, Image, Label } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import ChatPane from './ChatPane';

const Chat = () => {
	const [loading, setLoading] = useState(false);
	const rootStore = useContext(RootStoreContext);
	const { loadChats, chats, unreadMessages } = rootStore.chatStore;

	useEffect(() => {
		setLoading(true);
		loadChats().finally(() => setLoading(false));
	}, [loadChats]);

	if (loading)
		return (
			<Dimmer active inverted>
				<Loader />
			</Dimmer>
		);

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
					<Label empty circular color="red" size="mini" style={{marginTop: 10}} />
				)}
			</Menu.Item>
		),
		render: () => (
			<div>
				<ChatPane chat={chat} />
			</div>
		),
	}));

	return (
		<Fragment>
			<Tab
				style={{ marginTop: 20 }}
				menu={{ fluid: true, vertical: true }}
				menuPosition="left"
				panes={panes}
			/>
		</Fragment>
	);
};

export default observer(Chat);

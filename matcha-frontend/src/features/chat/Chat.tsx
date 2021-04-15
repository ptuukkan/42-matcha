import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Dimmer, Loader, Tab } from 'semantic-ui-react';
import { WsChatMessage } from '../../app/models/chat';
import { RootStoreContext } from '../../app/stores/rootStore';
import ChatPane from './ChatPane';

const Chat = () => {
	const [loading, setLoading] = useState(false);
	const rootStore = useContext(RootStoreContext);
	const {
		messages,
		sendMessage,
		loadChats,
		chats,
	} = rootStore.chatStore;
	const [message, setMessage] = useState('');

	const send = () => {
		const m = new WsChatMessage(message);
		sendMessage(JSON.stringify(m));
		setMessage('');
	};

	useEffect(() => {
		setLoading(true);
		loadChats().finally(() => setLoading(false));
	}, []);

	if (loading)
		return (
			<Dimmer active inverted>
				<Loader />
			</Dimmer>
		);

	const panes = chats.map((chat, i) => ({
		menuItem: i.toString(),
		render: () => <ChatPane messages={chat.messages} />,
	}));

	return (
		<Fragment>
			<input
				type="text"
				onChange={(event) => setMessage(event.target.value)}
				value={message}
			></input>
			<button type="button" onClick={send}>
				Send message
			</button>
			{messages.map((m, i) => (
				<p key={i}>{m}</p>
			))}
			<Tab
				menu={{ fluid: true, vertical: true }}
				menuPosition="left"
				panes={panes}
			/>
		</Fragment>
	);
};

export default observer(Chat);

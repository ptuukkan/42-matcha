import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Dimmer, Loader, Tab } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import ChatPane from './ChatPane';

const Chat = () => {
	const [loading, setLoading] = useState(false);
	const rootStore = useContext(RootStoreContext);
	const { messages, sendMessage, joinChat, loadChats, chats } = rootStore.chatStore;
	const [message, setMessage] = useState('');

	const send = () => {
		sendMessage(message);
		setMessage('');
	};

	useEffect(() => {
		setLoading(true);
		joinChat();
		loadChats().finally(() => setLoading(false));
	},[]);


	if (loading)
		return (
			<Dimmer active inverted>
				<Loader />
			</Dimmer>
		);

/* 	const panes = [
		{ menuItem: 'Tab 1', render: () => <Tab.Pane>Tab 1 Content</Tab.Pane> },
		{ menuItem: 'Tab 2', render: () => <Tab.Pane>Tab 2 Content</Tab.Pane> },
		{ menuItem: 'Tab 3', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
	  ]
 */
	const panes = chats.map((chat, i ) => ({ menuItem: i.toString(), render: () => <ChatPane messages={chat.messages}/>}))
	

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

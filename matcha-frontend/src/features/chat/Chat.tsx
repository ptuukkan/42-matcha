import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { RootStoreContext } from '../../app/stores/rootStore';

const Chat = () => {
	const rootStore = useContext(RootStoreContext);
	const { messages, sendMessage, joinChat } = rootStore.chatStore;
	const [message, setMessage] = useState("")

	const send = () => {
		sendMessage(message);
		setMessage("");
	}

	useEffect(() => {
		joinChat()
	})
	return (
		<Fragment>
			<input type="text" onChange={(event) => setMessage(event.target.value)} value={message}></input>
			<button type="button" onClick={send}>Send message</button>
			{messages.map((m, i) => <p key={i}>{m}</p>)}
		</Fragment>
	);
};

export default observer(Chat);

import { observer } from 'mobx-react-lite';
import { Fragment, useContext, useEffect, useState } from 'react';
import { Dimmer, Loader, Tab } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import ChatPane from './ChatPane';

const Chat = () => {
	const [loading, setLoading] = useState(false);
	const rootStore = useContext(RootStoreContext);
	const { loadChats, chats } = rootStore.chatStore;

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
		menuItem: chat.participant.firstName,
		render: () => (
			<div>
				<ChatPane chat={chat} />
			</div>
		),
	}));

	return (
		<Fragment>
			<Tab
				menu={{ fluid: true, vertical: true }}
				menuPosition="left"
				panes={panes}
			/>
		</Fragment>
	);
};

export default observer(Chat);

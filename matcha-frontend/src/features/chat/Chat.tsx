import { useContext, useEffect, useState } from 'react';
import { Dimmer, Header, Loader } from 'semantic-ui-react';
import { AppMedia } from '../../app/layout/AppMedia';
import { RootStoreContext } from '../../app/stores/rootStore';
import ComputerChat from './ComputerChat';
import MobileChat from './MobileChat';

const Chat = () => {
	const { Media, MediaContextProvider } = AppMedia;
	const [loading, setLoading] = useState(true);
	const rootStore = useContext(RootStoreContext);
	const { loadChats, chats } = rootStore.chatStore;

	useEffect(() => {
		loadChats().finally(() => setLoading(false));
	}, [loadChats]);

	if (loading)
		return (
			<Dimmer active inverted>
				<Loader />
			</Dimmer>
		);

	if (chats.length === 0) return <Header>Get more chats with matches!</Header>;

	return (
		<MediaContextProvider>
			<Media at="xs">
				<MobileChat />
			</Media>
			<Media greaterThanOrEqual="sm">
				<ComputerChat />
			</Media>
		</MediaContextProvider>
	);
};

export default Chat;

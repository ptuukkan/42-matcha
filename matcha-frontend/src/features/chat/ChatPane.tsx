import { observer } from 'mobx-react-lite';
import { useContext, useState } from 'react';
import {
	Tab,
	Image,
	GridRow,
	Input,
	Container,
	Divider,
	Message,
} from 'semantic-ui-react';
import { IChat, IWsChatMessage } from '../../app/models/chat';
import { RootStoreContext } from '../../app/stores/rootStore';

interface IProps {
	chat: IChat;
}
/* const temp_messages = [
	{ participant: 'Guest', message: 'Hi! 🙂', time: '20:30' },
	{ participant: 'You', message: 'Hello!', time: '20:35' },
	{ participant: 'Guest', message: 'What are you doing?', time: '21:30' },
	{ participant: 'You', message: 'Drinking!', time: '23:56' },
	{ participant: 'Guest', message: '😳', time: '23:58' },
]; */

const ChatPane: React.FC<IProps> = ({ chat }) => {
	const rootStore = useContext(RootStoreContext);
	const [message, setMessage] = useState('');
	const { sendChatMessage } = rootStore.chatStore;
	const { profile } = rootStore.profileStore;

	const send = () => {
		const wsMessage: IWsChatMessage = {
			chatId: chat.chatId,
			message: message,
			to: chat.participant.id,
			from: profile!.id,
			timestamp: Date.now(),
		};
		sendChatMessage(wsMessage);
		setMessage('');
	};

	return (
		<Tab.Pane style={{ minHeight: 250 }}>
			<GridRow>
				<Image src={chat.participant.image.url} avatar />
				<span>{chat.participant.firstName}</span>
			</GridRow>
			<Divider />
			<Container style={{ minHeight: 160 }}>
				{chat.messages.map((m, i) =>
					m.from !== chat.participant.id ? (
						<Message key={i} style={{ textAlign: 'right' }}>
							<Message.Header>{m.message}</Message.Header>
							<p>{m.timestamp}</p>
						</Message>
					) : (
						<Message key={i}>
							<Message.Header>{m.message}</Message.Header>
							<p>{m.timestamp}</p>
						</Message>
					)
				)}
			</Container>
			<Input
				style={{ padding: 10 }}
				value={message}
				action={{
					color: 'pink',
					icon: 'send',
					content: 'Send',
					disabled: message === '',
					onClick: () => send(),
				}}
				onChange={(event) => setMessage(event.target.value)}
				placeholder="Message..."
				fluid
			/>
		</Tab.Pane>
	);
};

export default observer(ChatPane);

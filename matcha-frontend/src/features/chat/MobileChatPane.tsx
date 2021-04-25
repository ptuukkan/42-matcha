import format from 'date-fns/format';
import { observer } from 'mobx-react-lite';
import React, {
	Fragment,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import { Ref, Container, Message, Input } from 'semantic-ui-react';
import { IChat, IWsChatMessage } from '../../app/models/chat';
import { RootStoreContext } from '../../app/stores/rootStore';

interface IProps {
	chat: IChat;
}

const MobileChatPane: React.FC<IProps> = ({ chat }) => {
	const rootStore = useContext(RootStoreContext);
	const { sendChatMessage, unreadMessages, readMessages } = rootStore.chatStore;
	const { profile } = rootStore.profileStore;
	const [message, setMessage] = useState('');
	const [error, setError] = useState(false);
	const messageContainer = useRef<HTMLDivElement>(null);

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

	useEffect(() => {
		if (unreadMessages.includes(chat.chatId)) {
			readMessages(chat.chatId);
		}
		if (messageContainer.current) {
			messageContainer.current.scrollTo({
				top: messageContainer.current.scrollHeight,
			});
		}
	});

	return (
		<Fragment>
			<Ref innerRef={messageContainer}>
				<Container
					style={{
						height: '50vh',
						overflow: 'auto',
						padding: 10,
					}}
				>
					{chat.messages.map((m, i) =>
						m.from !== chat.participant.id ? (
							<Message
								key={i}
								style={{ textAlign: 'right', wordWrap: 'break-word' }}
							>
								<Message.Header>{format(m.timestamp, 'HH:mm')}</Message.Header>
								<Message.Content>{m.message}</Message.Content>
							</Message>
						) : (
							<Message key={i} style={{ wordWrap: 'break-word' }}>
								<Message.Header>{format(m.timestamp, 'HH:mm')}</Message.Header>
								<Message.Content>{m.message}</Message.Content>
							</Message>
						)
					)}
				</Container>
			</Ref>
			<Input
				error={error}
				style={{ padding: 10 }}
				value={message}
				action={{
					color: 'pink',
					icon: 'send',
					content: 'Send',
					disabled: message === '' || error,
					onClick: () => send(),
				}}
				onChange={(event) => {
					if (event.target.value.length > 255) {
						setError(true);
					} else if (error) {
						setError(false);
					}
					setMessage(event.target.value);
				}}
				placeholder="Message..."
				fluid
			/>
			{error && <Message error content="Message too long" />}
		</Fragment>
	);
};

export default observer(MobileChatPane);

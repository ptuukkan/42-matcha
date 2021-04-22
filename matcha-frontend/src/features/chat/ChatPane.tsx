import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
	Tab,
	Image,
	GridRow,
	Input,
	Container,
	Divider,
	Message,
	Ref,
	Header,
} from 'semantic-ui-react';
import { IChat, IWsChatMessage } from '../../app/models/chat';
import { RootStoreContext } from '../../app/stores/rootStore';
import format from 'date-fns/format';
import { Link } from 'react-router-dom';

interface IProps {
	chat: IChat;
}

const ChatPane: React.FC<IProps> = ({ chat }) => {
	const rootStore = useContext(RootStoreContext);
	const [message, setMessage] = useState('');
	const { sendChatMessage, unreadMessages, readMessages } = rootStore.chatStore;
	const { profile } = rootStore.profileStore;
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
		<Tab.Pane>
			<GridRow>
				<Image
					avatar
					src={chat.participant.image.url}
					style={{ marginRight: 10 }}
				/>
				<Header as={Link} to={`/profile/${chat.participant.id}`}>
					{chat.participant.firstName}
				</Header>
			</GridRow>
			<Divider />
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
							<Message key={i} style={{ textAlign: 'right' }}>
								<Message.Header>{format(m.timestamp, 'HH:mm')}</Message.Header>
								<Message.Content>{m.message}</Message.Content>
							</Message>
						) : (
							<Message key={i}>
								<Message.Header>{format(m.timestamp, 'HH:mm')}</Message.Header>
								<Message.Content>{m.message}</Message.Content>
							</Message>
						)
					)}
				</Container>
			</Ref>
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

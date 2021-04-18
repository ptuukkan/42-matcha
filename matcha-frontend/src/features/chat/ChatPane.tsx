import {
	Tab,
	Image,
	GridRow,
	Input,
	Container,
	Divider,
	Message,
} from 'semantic-ui-react';
import { IChat } from '../../app/models/chat';

interface IProps {
	chat: IChat;
}
const temp_messages = [
	{ participant: 'Guest', message: 'Hi! 🙂', time: '20:30' },
	{ participant: 'You', message: 'Hello!', time: '20:35' },
	{ participant: 'Guest', message: 'What are you doing?', time: '21:30' },
	{ participant: 'You', message: 'Drinking!', time: '23:56' },
	{ participant: 'Guest', message: '😳', time: '23:58' },
];

const ChatPane: React.FC<IProps> = ({ chat }) => {

	return (
		<Tab.Pane style={{ minHeight: 250 }}>
			<GridRow>
				<Image src={chat.participant.image.url} avatar />
				<span>{chat.participant.firstName}</span>
			</GridRow>
			<Divider />
			<Container style={{ minHeight: 160 }}>
				{temp_messages.map((m) =>
					m.participant === 'You' ? (
						<Message  style={{ textAlign: 'right' }}>
							<Message.Header>{m.message}</Message.Header>
							<p>{m.time}</p>
						</Message>
					) : (
						<Message >
							<Message.Header>{m.message}</Message.Header>
							<p>{m.time}</p>
						</Message>
					)
				)}
			</Container>
			{chat.messages.map((m, i) => (
				<p key={i}>{m}</p>
			))}
			<Input
				style={{ padding: 10 }}
				action={{
					color: 'pink',
					icon: 'send',
					content: 'Send',
				}}
				placeholder="Message..."
				fluid
			/>
		</Tab.Pane>
	);
};

export default ChatPane;

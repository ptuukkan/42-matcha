import React from 'react';
import { Tab, Image, Button, GridRow, Input, Container } from 'semantic-ui-react';
import { IChat } from '../../app/models/chat';

interface IProps {
	chat: IChat;
}

const ChatPane: React.FC<IProps> = ({ chat }) => {
	return (
		<Tab.Pane style={{ minHeight: 250}}>
			<GridRow>
				<Image src={chat.participant.image.url} avatar />
				<span>{chat.participant.firstName}</span>
			</GridRow>
			<Container style={{minHeight: 130}}>

			</Container>
			{chat.messages.map((m, i) => (
				<p key={i}>{m}</p>
			))}
			<Input fluid/>
			<Button floated="right" color="pink" icon="send" content="Send" />
		</Tab.Pane>
	);
};

export default ChatPane;

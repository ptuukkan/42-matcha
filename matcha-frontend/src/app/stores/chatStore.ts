import { makeAutoObservable, runInAction } from 'mobx';
import { toast } from 'react-toastify';
import agent from '../api/agent';
import { IChat, IWsChatMessage, IWsOnlineMessage } from '../models/chat';
import { RootStore } from './rootStore';

export default class ChatStore {
	rootStore: RootStore;
	messages: string[] = [];
	webSocket: WebSocket | null = null;
	chats: IChat[] = [];
	unreadMessages: string[] = [];

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeAutoObservable(this);
	}

	joinChat = () => {
		if (!this.webSocket) {
			this.webSocket = new WebSocket('ws://localhost:8080/ws/chat');
			this.webSocket.addEventListener('open', () => {
				const m: IWsOnlineMessage = {
					profileId: this.rootStore.profileStore.profile!.id,
				};
				this.sendMessage(JSON.stringify(m));
			});
			this.webSocket.addEventListener('message', (event) => {
				console.log('Message from server ', event.data);
				this.recieveMessage(event.data);
			});
		}
	};

	sendMessage = (message: string) => {
		if (this.webSocket) {
			this.webSocket.send(message);
		}
	};

	recieveMessage = (message: string) => {
		let wsChatMessage: IWsChatMessage = JSON.parse(message);
		this.pushChatMessage(wsChatMessage);
		this.unreadMessages.push(wsChatMessage.chatId);
		toast.info('You have new chat messages!');
	};

	loadChats = async () => {
		try {
			const chats = await agent.Chat.getAll();
			runInAction(() => (this.chats = chats));
		} catch (error) {
			console.log(error);
		}
	};

	leaveChat = () => {
		if (this.webSocket) {
			this.webSocket.close();
			this.webSocket = null;
		}
	};

	pushChatMessage = (message: IWsChatMessage) => {
		const chat = this.chats.find((c) => c.chatId === message.chatId);
		if (chat) {
			chat.messages.push({
				from: message.from,
				timestamp: message.timestamp,
				message: message.message,
			});
			this.chats = this.chats.map((c) => {
				if (c.chatId === chat.chatId) {
					return chat;
				} else {
					return c;
				}
			});
			return true;
		} else {
			return false;
		}
	};

	sendChatMessage = (message: IWsChatMessage) => {
		if (this.pushChatMessage(message)) {
			this.sendMessage(JSON.stringify(message));
		}
	};

	readMessages = (chatId: string) => {
		this.unreadMessages = this.unreadMessages.filter((x) => x !== chatId);
	};
}

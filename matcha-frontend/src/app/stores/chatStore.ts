import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { IChat, IWsChatMessage, IWsOnlineMessage } from '../models/chat';
import { INotification } from '../models/notification';
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
				this.receiveMessage(event.data);
			});
		}
	};

	sendMessage = (message: string) => {
		if (this.webSocket) {
			this.webSocket.send(message);
		}
	};

	receiveMessage = (message: string) => {
		let obj: any = JSON.parse(message);
		if (obj.messageType === 'ChatMessage') {
			let wsChatMessage: IWsChatMessage = obj.message;
			this.pushChatMessage(wsChatMessage);
			this.chats = this.chats.map((chat) =>
				chat.chatId === wsChatMessage.chatId ? { ...chat, unread: true } : chat
			);
			this.unreadMessages.push(wsChatMessage.chatId);
		} else if (obj.messageType === 'NotificationMessage') {
			let notification: INotification = obj.message;
			this.rootStore.profileStore.addNotification(notification);
		}
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

	get unreadChats() {
		return this.chats.filter((chat) => chat.unread);
	}

	readChat = async (chatId: string) => {
		this.chats = this.chats.map((chat) =>
			chat.chatId === chatId ? { ...chat, unread: false } : chat
		);
		try {
			await agent.Chat.read(chatId);
		} catch (error) {
			console.log(error);
		}
	};
}

import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { IChat, WsOnlineMessage } from '../models/chat';
import { RootStore } from './rootStore';

export default class ChatStore {
	rootStore: RootStore;

	messages: string[] = [];
	webSocket: WebSocket | null = null;
	chats: IChat[] = [];

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeAutoObservable(this);
	}

	joinChat = () => {
		if (!this.webSocket) {
			this.webSocket = new WebSocket('ws://localhost:8080/ws/chat');
			this.webSocket.addEventListener('open', () => {
				const m = new WsOnlineMessage(this.rootStore.profileStore.profile!.id);
				console.dir(m)
				this.sendMessage(JSON.stringify(m));
			});
			this.webSocket.addEventListener('message', (event) => {
				console.log('Message from server ', event.data);
				this.recieveMessage(event.data);
			});
		}
	};

	sendMessage = (message: string) => {
		this.webSocket!.send(message);
	};

	recieveMessage = (message: string) => {
		this.messages.push(message);
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
}

import { makeAutoObservable } from 'mobx';
import { RootStore } from './rootStore';

export default class ChatStore {
	rootStore: RootStore;

	messages: string[] = []
	webSocket: WebSocket | null = null;


	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeAutoObservable(this)
			
	}

	joinChat = () => {
		if (!this.webSocket) {
			this.webSocket = new WebSocket('ws://localhost:8080/chat');
			this.webSocket.addEventListener('message',(event) => {
				console.log('Message from server ', event.data);
				this.recieveMessage(event.data)
			})
		}
	}

	sendMessage = (message: string) => {
		console.log(message)
		this.webSocket!.send(message);
	}

	recieveMessage = (message: string) => {
		this.messages.push(message)
	}
}

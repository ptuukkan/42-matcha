import { configure } from 'mobx';
import { createContext } from 'react';
import ModalStore from './modalStore';
import UserStore from './userStore';
import ProfileStore from './profileStore';
import ChatStore from './chatStore';

configure({ enforceActions: 'always' });

export class RootStore {
	modalStore: ModalStore;
	userStore: UserStore;
	profileStore: ProfileStore;
	chatStore: ChatStore;

	constructor() {
		this.modalStore = new ModalStore(this);
		this.userStore = new UserStore(this);
		this.profileStore = new ProfileStore(this);
		this.chatStore = new ChatStore(this);
	}
}

export const RootStoreContext = createContext(new RootStore());

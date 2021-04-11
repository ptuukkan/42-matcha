import { configure } from 'mobx';
import { createContext } from 'react';
import ModalStore from './modalStore';
import UserStore from './userStore';
import ProfileStore from './profileStore';

configure({ enforceActions: 'always' });

export class RootStore {
	modalStore: ModalStore;
	userStore: UserStore;
	profileStore: ProfileStore;

	constructor() {
		this.modalStore = new ModalStore(this);
		this.userStore = new UserStore(this);
		this.profileStore = new ProfileStore(this);
	}
}

export const RootStoreContext = createContext(new RootStore());

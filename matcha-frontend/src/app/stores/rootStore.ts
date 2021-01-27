import { configure } from "mobx";
import { createContext } from "react";
import ModalStore from "./modalStore";
import UserStore from "./userStore";

configure ({enforceActions: 'always'});

export class RootStore {
	modalStore: ModalStore;
	userStore: UserStore;

	constructor() {
		this.modalStore = new ModalStore(this);
		this.userStore = new UserStore(this);
	}
}

export const RootStoreContext = createContext(new RootStore());


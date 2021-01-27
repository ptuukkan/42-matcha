import { action, makeObservable, observable } from "mobx";
import { RootStore } from "./rootStore";

export default class ModalStore {
	rootStore: RootStore;
	registerOpen = false;
	loginOpen = false;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeObservable(this, {
			registerOpen: observable,
			loginOpen: observable,
			openRegisterModal: action,
			closeRegisterModal: action,
			openLoginModal: action,
			closeLoginModal: action,
		});
	}

	openRegisterModal = () => {
		this.registerOpen = true;
	}

	closeRegisterModal = () => {
		this.registerOpen = false;
	}

	openLoginModal = () => {
		this.loginOpen = true;
	}

	closeLoginModal = () => {
		this.loginOpen = false;
	}
}

import { action, makeObservable, observable } from "mobx";
import { RootStore } from "./rootStore";

export default class ModalStore {
	rootStore: RootStore;
	registerOpen = false;
	registerFinishOpen = false;
	loginOpen = false;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeObservable(this, {
			registerOpen: observable,
			registerFinishOpen: observable,
			loginOpen: observable,
			openRegister: action,
			closeRegister: action,
			openRegisterFinish: action,
			closeRegisterFinish: action,
			openLogin: action,
			closeLogin: action,
		});
	}

	openRegister = () => {
		this.registerOpen = true;
	}

	closeRegister = () => {
		this.registerOpen = false;
	}

	openRegisterFinish = () => {
		this.registerFinishOpen = true;
	}

	closeRegisterFinish = () => {
		this.registerFinishOpen = false;
		this.registerOpen = false;
	}

	openLogin = () => {
		this.loginOpen = true;
	}

	closeLogin = () => {
		this.loginOpen = false;
	}
}

import { action, makeObservable, observable } from "mobx";
import { RootStore } from "./rootStore";

export default class ModalStore {
	rootStore: RootStore;
	registerOpen = false;
	forgetOpen = false;
	registerFinishOpen = false;
	loginOpen = false;
	successOpen = false;


	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeObservable(this, {
			registerOpen: observable,
			registerFinishOpen: observable,
			loginOpen: observable,
			forgetOpen: observable,
			openRegister: action,
			closeRegister: action,
			openForget: action,
			closeForget: action,
			openSuccess: action,
			closeSuccess: action,
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

	openForget = () => {
		this.forgetOpen = true;
	}

	closeForget = () => {
		this.forgetOpen = false;
	}

	openSuccess = () => {
		this.successOpen = true;
	}

	closeSuccess = () => {
		this.successOpen = false;
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

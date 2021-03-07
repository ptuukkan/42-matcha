import { action, makeObservable, observable } from "mobx";
import { RootStore } from "./rootStore";

export default class ModalStore {
	rootStore: RootStore;
	registerOpen = false;
	forgetOpen = false;
	firstLogin = true;
	registerFinishOpen = false;
	loginOpen = false;
	successOpen = false;
	profilePhotoOpen = false;


	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeObservable(this, {
			registerOpen: observable,
			registerFinishOpen: observable,
			loginOpen: observable,
			forgetOpen: observable,
			successOpen: observable,
			profilePhotoOpen: observable,
			closeProfilePhoto: action,
			openProfilePhoto: action,
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

	closeFirstLogin = () => {
		this.firstLogin = false;
	}

	closeForget = () => {
		this.forgetOpen = false;
	}

	closeProfilePhoto = () => {
		this.profilePhotoOpen = false;
	}
	
	openProfilePhoto = () => {
		console.log('here')
		this.profilePhotoOpen = true;
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

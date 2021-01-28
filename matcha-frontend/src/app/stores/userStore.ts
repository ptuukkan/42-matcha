import { action, makeObservable, observable } from "mobx";
import agent from "../api/agent";
import { ILoginFormValues, IRegisterFormValues } from "../models/user";
import { RootStore } from "./rootStore";

export default class UserStore {
	rootStore: RootStore;
	secondOpen = false;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeObservable(this, {
			secondOpen: observable,
			registerUser: action,
			loginUser: action,
			setSecondOpen: action,
			setSecondClose: action
		});
	}

	registerUser = async (data: IRegisterFormValues) => {
		agent.User.register(data).catch(error => {
			console.log('Error: ',error)
		})
	}

	loginUser = (data: ILoginFormValues) => {
		console.log(data)
		
	}

	setSecondOpen = () => {
		this.secondOpen = true;
	}

	setSecondClose = () => {
		this.secondOpen = false;
		this.rootStore.modalStore.closeRegisterModal();

	}
}
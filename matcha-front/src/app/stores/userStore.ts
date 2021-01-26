import { action, makeObservable, observable } from "mobx";
import { IRegisterFormValues } from "../models/user";
import { RootStore } from "./rootStore";

export default class UserStore {
	rootStore: RootStore;
	secondOpen = false;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeObservable(this, {
			secondOpen: observable,
			registerUser: action,
			setSecondOpen: action,
			setSecondClose: action
		});
	}

	registerUser = (data: IRegisterFormValues) => {
		console.log(data);

	}

	setSecondOpen = () => {
		this.secondOpen = true;
	}

	setSecondClose = () => {
		this.secondOpen = false;
	}
}
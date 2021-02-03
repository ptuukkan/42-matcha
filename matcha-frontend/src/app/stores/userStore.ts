import { action, makeObservable, observable, runInAction } from "mobx";
import agent from "../api/agent";
import { ILoginFormValues, IRegisterFormValues } from "../models/user";
import { RootStore } from "./rootStore";

export default class UserStore {
	rootStore: RootStore;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeObservable(this, {
			registerUser: action,
			loginUser: action,
		});
	}

	registerUser = async (data: IRegisterFormValues): Promise<void> => {
		try {
			await agent.User.register(data);
			this.rootStore.modalStore.openRegisterFinish();
		} catch (error) {
			throw error
		}
	}

	loginUser = (data: ILoginFormValues) => {
		console.log(data)

	}
}

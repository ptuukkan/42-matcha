import { action, makeObservable, observable } from 'mobx';	
import agent from '../api/agent';
import { ILoginFormValues, IRegisterFormValues } from '../models/user';
import { RootStore } from './rootStore';

export default class UserStore {
	rootStore: RootStore;
	loading = false;
	token: string | null = window.localStorage.getItem("jwt");

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeObservable(this, {
			token: observable,
			loading: observable,
			registerUser: action,
			loginUser: action,
			stopLoading: action,
			setToken: action
		});
	}

	stopLoading = () => {
		this.loading = false;
	};

	setToken = (token: string) => {
		this.token = token;
		window.localStorage.setItem("jwt", this.token);
	}

	registerUser = async (data: IRegisterFormValues) => {
		this.loading = true;
		try {
			await agent.User.register(data);
			this.stopLoading();
			this.rootStore.modalStore.openRegisterFinish();
		} catch (error) {
			this.stopLoading();
			throw error;
		}
	};

	loginUser = async (data: ILoginFormValues) => {
		this.loading = true;
		try {
			const token = await agent.User.login(data);
			this.setToken(token);
			this.stopLoading();
			this.rootStore.modalStore.closeLogin();
		} catch (error) {
			this.stopLoading();
			throw error;
		}
	};
}

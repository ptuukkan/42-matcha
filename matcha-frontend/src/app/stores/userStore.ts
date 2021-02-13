import axios from 'axios';
import { action, makeObservable, observable, runInAction } from 'mobx';
import agent from '../api/agent';
import { ILoginFormValues, IRegisterFormValues, IUser } from '../models/user';
import { RootStore } from './rootStore';

export default class UserStore {
	rootStore: RootStore;
	loading = false;
	token: string | null = window.localStorage.getItem('jwt');
	user: IUser | null = null;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeObservable(this, {
			token: observable,
			loading: observable,
			user: observable,
			registerUser: action,
			loginUser: action,
			getUser: action,
			stopLoading: action,
			setToken: action,
		});
	}

	stopLoading = () => {
		this.loading = false;
	};

	setToken = (token: string) => {
		this.token = token;
		window.localStorage.setItem('jwt', this.token);
	};

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
			const user = await agent.User.login(data);
			runInAction(() => {
				this.user = user;
			});
			this.setToken(user.token);
			this.stopLoading();
			this.rootStore.modalStore.closeLogin();
		} catch (error) {
			this.stopLoading();
			throw error;
		}
	};

	getUser = async () => {
		try {
			const user = await agent.User.current();
			runInAction(() => {
				this.user = user;
			});
		} catch (error) {
			console.log(error);
		}
	};
}

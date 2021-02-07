import { action, makeObservable, observable } from 'mobx';
import agent from '../api/agent';
import { ILoginFormValues, IRegisterFormValues } from '../models/user';
import { RootStore } from './rootStore';

export default class UserStore {
	rootStore: RootStore;
	loading = false;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeObservable(this, {
			loading: observable,
			registerUser: action,
			loginUser: action,
			stopLoading: action,
		});
	}

	stopLoading = () => {
		this.loading = false;
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
			await agent.User.login(data);
			this.stopLoading();
		} catch (error) {
			this.stopLoading();
			throw error;
		}
	};
}

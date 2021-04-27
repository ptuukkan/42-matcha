import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import {
	ICredentialFormValues,
	ILoginFormValues,
	IRegisterFormValues,
	IUser,
} from '../models/user';
import { RootStore } from './rootStore';
import { history } from '../..';
import { FORM_ERROR } from 'final-form';
import { IValidationError } from '../models/errors';
import { getLocation } from '../common/location/locationUtils';

export default class UserStore {
	rootStore: RootStore;
	loading = false;
	token: string | null = window.localStorage.getItem('jwt');
	user: IUser | null = null;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeAutoObservable(this);
	}

	stopLoading = () => {
		this.loading = false;
	};

	logoutUser = () => {
		this.token = null;
		this.user = null;
		this.rootStore.profileStore.profile = null;
		this.rootStore.chatStore.leaveChat();
		window.localStorage.removeItem('jwt');
	};

	setToken = (token: string) => {
		this.token = token;
		window.localStorage.setItem('jwt', this.token);
	};

	registerUser = async (data: IRegisterFormValues) => {
		try {
			await agent.User.register(data);
		} catch (error) {
			if (error.error_type === 'ValidationError') {
				return error.errors.reduce((obj: any, item: IValidationError) => {
					obj[item.field] = item.message;
					return obj;
				}, {});
			}
			return { [FORM_ERROR]: error.message };
		}
	};

	changeCredentials = async (data: ICredentialFormValues) => {
		try {
			await agent.User.credentials(data);
		} catch (error) {
			if (error.error_type === 'ValidationError') {
				return error.errors.reduce((obj: any, item: IValidationError) => {
					obj[item.field] = item.message;
					return obj;
				}, {});
			}
			return { [FORM_ERROR]: error.message };
		}
	};

	loginUser = async (data: ILoginFormValues) => {
		try {
			const user = await agent.User.login(data);
			this.setToken(user.token);
			this.rootStore.modalStore.closeModal();
			await this.rootStore.profileStore.getProfile();
			runInAction(() => {
				this.user = user;
			});
			history.push('/');
		} catch (error) {
			return { [FORM_ERROR]: error.message };
		}
	};

	getUser = async () => {
		try {
			const location = await getLocation();
			const user = await agent.User.current(location);
			await this.rootStore.profileStore.getProfile();
			runInAction(() => {
				this.user = user;
			});
		} catch (error) {
			console.log(error);
			throw error;
		}
	};
}

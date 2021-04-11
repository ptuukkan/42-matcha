import { action, makeObservable, observable, runInAction } from 'mobx';
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
import { getPosition } from '../common/location/locationUtils';
import { ILocation } from '../models/profile';

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
			changeCredentials: action,
			loginUser: action,
			logoutUser: action,
			getUser: action,
			stopLoading: action,
			setToken: action,
		});
	}

	stopLoading = () => {
		this.loading = false;
	};

	logoutUser = () => {
		this.token = null;
		this.user = null;
		this.rootStore.profileStore.profile = null;
		this.rootStore.profileStore.stopHeartbeat();
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
			runInAction(() => {
				this.user = user;
			});
			this.setToken(user.token);
			await this.rootStore.profileStore.getProfile();
			this.rootStore.modalStore.closeModal();
			history.push('/');
		} catch (error) {
			return { [FORM_ERROR]: error.message };
		}
	};

	getUser = async () => {
		let location: ILocation = { latitude: 0, longitude: 0 };
		try {
			const geoLocation = await getPosition({timeout: 2000});
			location.latitude = geoLocation.coords.latitude;
			location.longitude = geoLocation.coords.longitude;
		} catch (error) {
			const ipLocation = await agent.Location.get();
			location.latitude = ipLocation.latitude;
			location.longitude = ipLocation.longitude;
		}
		try {
			const user = await agent.User.current(location);
			runInAction(() => {
				this.user = user;
			});
			await this.rootStore.profileStore.getProfile();
		} catch (error) {
			console.log(error);
		}
	};
}

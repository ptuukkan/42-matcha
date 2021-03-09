import { action, makeObservable, observable, runInAction } from 'mobx';
import agent from '../api/agent';
import {
	IProfile
} from '../models/profile';
import { RootStore } from './rootStore';

export default class UserStore {
	rootStore: RootStore;
	loading = false;
	profile: IProfile | null = null;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeObservable(this, {
			loading: observable,
			profile: observable,
			getProfile: action,
			stopLoading: action,
		});
	}

	stopLoading = () => {
		this.loading = false;
	};

	getProfile = async () => {
		try {
			const profile = await agent.Profile.current();
			runInAction(() => {
				this.profile = profile;
			});
		} catch (error) {
			console.log(error);
		}
	};
}

import { action, makeObservable, observable, runInAction } from 'mobx';
import agent from '../api/agent';
import { IProfile, IProfileFormValues } from '../models/profile';
import { RootStore } from './rootStore';

export default class ProfileStore {
	rootStore: RootStore;
	loading = false;
	profile: IProfile | null = null;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeObservable(this, {
			loading: observable,
			profile: observable,
			getProfile: action,
			removeImage: action,
			stopLoading: action,
		});
	}

	stopLoading = () => {
		this.loading = false;
	};

	getProfile = async () => {
		this.loading = true;
		try {
			const profile = await agent.Profile.current();
			runInAction(() => {
				this.profile = profile;
				console.log(this.profile.images.map((im) => im.url));
			});
		} catch (error) {
			console.log(error);
		} finally {
			this.stopLoading();
		}
	};

	removeImage = async (id: string) => {
		try {
			agent.Profile.removeImage(id).then(() => {
				runInAction(
					() =>
						(this.profile!.images = this.profile!.images.filter(
							(i) => i.id != id
						))
				);
			});
		} catch (error) {
			console.log(error);
		}
	};

	setMain = async (id: string) => {
		try {
			agent.Profile.imageToMain(id).then(() => {
				runInAction(() => {
					this.profile?.images.forEach((image) => {
						image.id === id ? (image.isMain = true) : (image.isMain = false);
					});
				});
			});
		} catch (error) {
			console.log(error);
		}
	};

	addImage = async (data: FormData) => {
		try {
			agent.Profile.addImage(data).then((image) => {
				runInAction(() => this.profile?.images.push(image));
			});
		} catch (error) {
			console.log(error);
		}
	};

	updateProfile = async (data: IProfileFormValues) => {
		try {
			agent.Profile.update(data)
		} catch (e){
			() => console.log(e)
		}
	}
}

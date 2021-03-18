import { FORM_ERROR } from 'final-form';
import { action, makeObservable, observable, runInAction } from 'mobx';
import agent from '../api/agent';
import { IProfile, IProfileFormValues, stringToGender, stringToSexPref } from '../models/profile';
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
			updateProfile: action,
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
			});
		} catch (error) {
			console.log(error);
		} finally {
			this.stopLoading();
		}
	};

	updateProfile = async (data: IProfileFormValues): Promise<void | any>  => {
		try {
			await agent.Profile.update(data);
			runInAction(() => {
				this.profile!.firstName = data.firstName;
				this.profile!.biography = data.biography;
				// this.profile!.gender = stringToGender(data.gender);
				this.profile!.interests = data.interests;
				this.profile!.lastName = data.lastName;
				// this.profile!.sexualPreference = stringToSexPref(data.sexualPreference);
			})
		} catch (error) {
			return { [FORM_ERROR]: error.message };
		}
	};

	removeImage = async (id: string) => {
		try {
			agent.Profile.removeImage(id).then(() => {
				runInAction(
					() =>
						(this.profile!.images = this.profile!.images.filter(
							(i) => i.id !== id
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
}

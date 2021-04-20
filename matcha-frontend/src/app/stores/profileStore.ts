import { FORM_ERROR } from 'final-form';
import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { INotification } from '../models/notification';
import {
	IPrivateProfile,
	IProfileFormValues,
	stringToGender,
	stringToSexPref,
} from '../models/profile';
import { RootStore } from './rootStore';

export default class ProfileStore {
	rootStore: RootStore;
	profile: IPrivateProfile | null = null;
	notifications: INotification[] = [];

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeAutoObservable(this);
	}

	getProfile = async () => {
		try {
			const profile = await agent.Profile.current();
			await this.loadNotifications();
			runInAction(() => {
				this.profile = profile;
			});
			this.rootStore.chatStore.joinChat();
		} catch (error) {
			console.log(error);
		}
	};

	updateProfile = async (data: IProfileFormValues): Promise<void | any> => {
		try {
			await agent.Profile.update(data);
			runInAction(() => {
				this.profile!.firstName = data.firstName;
				this.profile!.biography = data.biography;
				this.profile!.birthDate = data.birthDate;
				this.profile!.gender = stringToGender(data.gender);
				this.profile!.interests = data.interests;
				this.profile!.lastName = data.lastName;
				this.profile!.sexualPreference = stringToSexPref(data.sexualPreference);
				this.profile!.locationOverride = data.locationOverride;
				if (data.locationOverride) {
					this.profile!.location.latitude = data.location.latitude;
					this.profile!.location.longitude = data.location.longitude;
				}
			});
		} catch (error) {
			return { [FORM_ERROR]: error.message };
		}
	};

	removeImage = async (id: string) => {
		try {
			await agent.Profile.removeImage(id);
			runInAction(() => {
				this.profile!.images = this.profile!.images.filter((i) => i.id !== id);
			});
		} catch (error) {
			console.log(error);
		}
	};

	setMain = async (id: string) => {
		try {
			await agent.Profile.imageToMain(id);
			runInAction(() => {
				this.profile?.images.forEach((image) => {
					image.id === id ? (image.isMain = true) : (image.isMain = false);
				});
			});
		} catch (error) {
			console.log(error);
		}
	};

	addImage = async (data: FormData) => {
		try {
			const image = await agent.Profile.addImage(data);
			runInAction(() => this.profile?.images.push(image));
		} catch (error) {
			console.log(error);
		}
	};

	loadNotifications = async () => {
		try {
			const notifications = await agent.Notification.list();
			runInAction(() => (this.notifications = notifications));
		} catch (error) {
			console.log(error);
		}
	};

	get unreadNotificationsCount() {
		return this.unreadNotifications.length;
	}

	get unreadNotifications() {
		return this.notifications.filter((n) => !n.read);
	}

	readNotifications = async () => {
		const unreadNotifications = this.unreadNotifications.map((n) => n.id);
		if (unreadNotifications.length > 0) {
			try {
				// await agent.Notification.read(unreadNotifications);
				runInAction(() => {
					this.notifications = this.notifications.map((n) => ({
						...n,
						read: true,
					}));
				});
			} catch (error) {
				console.log(error);
			}
		}
	};

	clearNotifications = async () => {
		const readNotifications = this.notifications
			.filter((n) => n.read)
			.map((n) => n.id);
		if (readNotifications.length > 0) {
			try {
				await agent.Notification.clear(readNotifications);
				runInAction(() => {
					this.notifications = this.notifications.filter((n) => !n.read);
				});
			} catch (error) {
				console.log(error);
			}
		}
	};
}

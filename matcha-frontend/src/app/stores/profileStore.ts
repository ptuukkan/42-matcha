import { FORM_ERROR } from 'final-form';
import { makeAutoObservable, runInAction } from 'mobx';
import { toast } from 'react-toastify';
import agent from '../api/agent';
import { INotification } from '../models/notification';
import {
	IPrivateProfile,
	IProfileFormValues,
	stringToGender,
	stringToSexPref,
} from '../models/profile';
import { RootStore } from './rootStore';
import { history } from '../..';
import { getLocation } from '../common/location/locationUtils';

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
			await this.rootStore.chatStore.loadChats();
			if (!this.isCompleted) {
				history.push('/profile');
				toast.info("Welcome! Please fill your profile.")
			}
		} catch (error) {
			console.log(error);
		}
	};

	get isCompleted() {
		if (
			this.profile &&
			this.profile.biography &&
			this.profile.birthDate &&
			this.profile.gender &&
			this.profile.images.length > 0 &&
			this.profile.interests.length > 0 &&
			this.profile.sexualPreference
		) {
			return true;
		} else {
			return false;
		}
	}

	updateProfile = async (data: IProfileFormValues): Promise<void | any> => {
		try {
			if (!data.locationOverride) {
				data.location = await getLocation();
			}
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
		return this.notifications.filter((n) => !n.read).map((n) => n.id);
	}

	readNotifications = async (notifications: string[]) => {
		if (notifications.length > 0) {
			try {
				await agent.Notification.read(notifications);
				runInAction(() => {
					this.notifications = this.notifications.map((n) => {
						if (notifications.includes(n.id)) {
							return { ...n, read: true };
						} else {
							return n;
						}
					});
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

	addNotification = (notification: INotification) => {
		this.notifications.unshift(notification);
		toast.info(notification.toast);
	};
}

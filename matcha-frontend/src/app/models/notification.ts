import { IProfileThumbnail } from './profile';

export interface INotification {
	id: string;
	sentAt: string;
	profile: IProfileThumbnail;
	message: string;
	read: boolean;
}

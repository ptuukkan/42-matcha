import { IProfileThumbnail } from './profile';

export interface INotification {
	id: string;
	timestamp: number;
	profile: IProfileThumbnail;
	message: string;
	read: boolean;
}

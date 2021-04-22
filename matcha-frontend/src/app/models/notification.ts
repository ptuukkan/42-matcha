import { IProfileThumbnail } from './profile';

export interface INotification {
	id: string;
	timestamp: number;
	sourceProfile: IProfileThumbnail;
	message: string;
	toast: string;
	read: boolean;
}

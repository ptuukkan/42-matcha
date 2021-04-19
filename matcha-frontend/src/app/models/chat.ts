import { IProfileThumbnail } from "./profile";

export interface IChat {
	messages: IMessage[];
	participant: IProfileThumbnail;
}

export interface IMessage {
	from: string;
	timestamp: Date;
	message: string;
}

export class WsOnlineMessage {
	type: string = 'WsOnlineMessage';
	profileKey: string;

	constructor(profileKey: string) {
		this.profileKey = profileKey;
	}
}

export class WsChatMessage {
	type: string = 'WsChatMessage';
	message: string;

	constructor(message: string) {
		this.message = message;
	}
}

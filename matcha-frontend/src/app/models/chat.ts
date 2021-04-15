export interface IChat {
	messages: IMessage[];
}

export interface IMessage {
	from: string,
	timestamp: Date,
	message: string,
}
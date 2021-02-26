export interface IValidationError {
	field: string,
	message: string
}

export class BackendError {
	message: string

	constructor(message: string) {
		this.message = message
	}
}

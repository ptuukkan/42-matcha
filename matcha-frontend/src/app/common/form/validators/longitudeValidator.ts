interface FieldValidatorArgs {
	value: number;
	values?: any;
	customArgs?: any;
	message?: string | string[];
}

export const longitudeValidator = (fieldValidatorArgs: FieldValidatorArgs) => {
	const { value } = fieldValidatorArgs;

	const validationResult = {
		succeeded: true,
		type: 'COORDINATE',
		message: '',
	};

	if (isNaN(value)) {
		validationResult.succeeded = false;
		validationResult.message = 'Coordinate is not in valid format';
	} else if (value > 180 || value < -180) {
		validationResult.succeeded = false;
		validationResult.message = 'Longitude must be between -180 and 180';
	}

	return validationResult;
};

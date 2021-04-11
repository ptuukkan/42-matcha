interface FieldValidatorArgs {
	value: number;
	values?: any;
	customArgs?: any;
	message?: string | string[];
}

export const latitudeValidator = (fieldValidatorArgs: FieldValidatorArgs) => {
	const { value } = fieldValidatorArgs;

	const validationResult = {
		succeeded: true,
		type: 'COORDINATE',
		message: '',
	};

	if (isNaN(value)) {
		validationResult.succeeded = false;
		validationResult.message = 'Coordinate is not in valid format';
	} else if (value > 90 || value < -90) {
		validationResult.succeeded = false;
		validationResult.message = 'Latitude must be between -90 and 90';
	}

	return validationResult;
};

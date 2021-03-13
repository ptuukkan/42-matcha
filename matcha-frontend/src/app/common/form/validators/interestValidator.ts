interface FieldValidatorArgs {
	value: string[];
	values?: any;
	customArgs?: any;
	message?: string | string[];
}

export const interestValidator = (fieldValidatorArgs: FieldValidatorArgs) => {
	const { value } = fieldValidatorArgs;

	const validationResult = {
		succeeded: true,
		type: 'INTEREST',
		message: '',
	};

	const regexp = new RegExp('^[a-z0-9\-_:\.]+$');

	value.forEach((x) => {
		if (!regexp.test(x)) {
			validationResult.succeeded = false;
			validationResult.message =
				'Interests must contain only these characters: a-z, 0-9, _ - : . ';
		}
	});

	return validationResult;
};

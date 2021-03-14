import { Validators } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';
import { alphabetic } from '../../app/common/form/validators/alphabetic';
import { interestValidator } from '../../app/common/form/validators/interestValidator';
import { arrayRequired } from '@lemoncode/fonk-array-required-validator';

const validationSchema = {
	field: {
		firstName: [
			Validators.required.validator,
			{
				validator: Validators.minLength,
				customArgs: { length: 2 },
				message: 'Must be at least 2 characters.',
			},
			{
				validator: Validators.maxLength,
				customArgs: { length: 33 },
				message: 'Must be less than 33 characters.',
			},
			alphabetic,
		],
		lastName: [
			Validators.required.validator,
			{
				validator: Validators.minLength,
				customArgs: { length: 2 },
				message: 'Must be at least 2 characters.',
			},
			{
				validator: Validators.maxLength,
				customArgs: { length: 33 },
				message: 'Must be less than 33 characters.',
			},
			alphabetic,
		],
		interests: [interestValidator, arrayRequired.validator],
		biography: [Validators.required.validator],
		gender: [Validators.required.validator],
		sexualPreference: [Validators.required.validator],
	},
};

export const formValidation = createFinalFormValidation(validationSchema);

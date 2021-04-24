import { Validators } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';
import { alphabetic } from '../../app/common/form/validators/alphabetic';
import { passwordComplexity } from '../../app/common/form/validators/passwordComplexity';

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
				customArgs: { length: 32 },
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
				customArgs: { length: 32 },
				message: 'Must be less than 33 characters.',
			},
			alphabetic,
		],
		username: [
			Validators.required.validator,
			{
				validator: Validators.minLength,
				customArgs: { length: 2 },
				message: 'Must be at least 2 characters.',
			},
			{
				validator: Validators.maxLength,
				customArgs: { length: 32 },
				message: 'Must be less than 33 characters.',
			},
			alphabetic,
		],
		emailAddress: [Validators.required.validator, Validators.email.validator],
		password: [
			Validators.required.validator,
			passwordComplexity,
			{
				validator: Validators.minLength,
				customArgs: { length: 8 },
				message: 'Must be at least 8 characters.',
			},
			{
				validator: Validators.maxLength,
				customArgs: { length: 99 },
				message: 'Must be less than 100 characters.',
			},
		],
	},
};

export const formValidation = createFinalFormValidation(validationSchema);

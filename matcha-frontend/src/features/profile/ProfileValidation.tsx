import { Validators } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';
import { alphabetic } from '../../app/common/form/validators/alphabetic';
import { interestValidator } from '../../app/common/form/validators/interestValidator';
import { arrayRequired } from '@lemoncode/fonk-array-required-validator';
import { latitudeValidator } from '../../app/common/form/validators/latitudeValidator';
import { longitudeValidator } from '../../app/common/form/validators/longitudeValidator';

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
		interests: [interestValidator, arrayRequired.validator],
		biography: [Validators.required.validator],
		gender: [Validators.required.validator],
		sexualPreference: [Validators.required.validator],
		'location.latitude': [Validators.required.validator, latitudeValidator],
		'location.longitude': [Validators.required.validator, longitudeValidator],
	},
};

export const formValidation = createFinalFormValidation(validationSchema);

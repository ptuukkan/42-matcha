import { Validators } from "@lemoncode/fonk";
import { createFinalFormValidation } from "@lemoncode/fonk-final-form";
import { alphabetic } from "../../app/common/form/validators/alphabetic";
import { interestValidator } from "../../app/common/form/validators/interestValidator";

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
		interests :[
			interestValidator
		]
	},
};

export const formValidation = createFinalFormValidation(validationSchema);

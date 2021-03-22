import { Validators } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';
import { passwordComplexity } from '../../app/common/form/validators/passwordComplexity';

const validationSchema = {
	field: {
		emailAddress: [Validators.required.validator, Validators.email.validator],
		password: [Validators.required.validator, passwordComplexity],
	},
};

export const formValidation = createFinalFormValidation(validationSchema);

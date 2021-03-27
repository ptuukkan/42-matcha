import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { Checkbox, Form, FormFieldProps, Label } from 'semantic-ui-react';

interface IProps extends FieldRenderProps<string>, FormFieldProps {}

const CheckboxInput: React.FC<IProps> = ({
	label,
	type,
	input,
	meta: { touched, error, submitError, dirtySinceLastSubmit },
}) => {
	console.log(input)
	return (
		<Form.Field error={touched && !!error} type={type}>
			<Checkbox label={label}/>
			{touched && (error || (submitError && !dirtySinceLastSubmit)) && (
				<Label basic color="red">
					{error || submitError}
				</Label>
			)}
		</Form.Field>
	);
};

export default CheckboxInput;

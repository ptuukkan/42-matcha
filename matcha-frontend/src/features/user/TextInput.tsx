import { ErrorMessage } from '@hookform/error-message';
import React, { RefObject } from 'react';
import { DeepMap, FieldError } from 'react-hook-form';
import { Form, Message } from 'semantic-ui-react';

interface IProps {
	type: string;
	name: string,
	label: string;
	errors: DeepMap<Record<string, any>, FieldError>;
	register: string | ((instance: HTMLInputElement | null) => void) | RefObject<HTMLInputElement> | null | undefined;
}

const TextInput: React.FC<IProps> = ({ type, name, label, errors, register }) => {
	return (
		<Form.Field>
			<label>{label}</label>
			<input type={type} name={name} placeholder={label} ref={register} />
			<ErrorMessage
				errors={errors}
				name={name}
				render={({ message }) => <Message negative>{message}</Message>}
			/>
		</Form.Field>
	);
};

export default TextInput;

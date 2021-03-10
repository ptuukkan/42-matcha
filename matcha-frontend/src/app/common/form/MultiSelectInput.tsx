import React, { useState } from 'react';
import { FieldRenderProps } from 'react-final-form';
import { FormFieldProps, Form, Label, Dropdown } from 'semantic-ui-react';

interface IProps
	extends FieldRenderProps<string, HTMLElement>,
		FormFieldProps {}

const MultiSelectInput: React.FC<IProps> = ({
	input,
	width,
	options,
	placeholder,
	meta: { touched, error },
}) => {
	const [interests, setInterests] = useState(options);
	return (
		<Form.Field error={touched && !!error} width={width}>
			<label>{placeholder}</label>
			<Dropdown
				value={input.value || []}
				onChange={(e, data) => input.onChange(data.value)}
				placeholder={placeholder}
				options={interests}
				selection
				multiple
				search
				searchable="true"
				allowAdditions
				additionLabel={<i style={{ color: 'red' }}>New interest: </i>}
				onAddItem={(e, { value }: any) =>
					setInterests(interests.concat({ text: value, value }))
				}
			/>
			{touched && error && (
				<Label basic color="red">
					{error}
				</Label>
			)}
		</Form.Field>
	);
};

export default MultiSelectInput;

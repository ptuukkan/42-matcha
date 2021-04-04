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
	meta: { touched, modified, error },
}) => {
	const [interests, setInterests] = useState(options);

	const renderLabel = (label: any) => ({
		basic: true,
		color: "pink",
		content: label.text,
	})

	return (
		<Form.Field error={(touched || modified) && !!error} width={width}>
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
				renderLabel={renderLabel}
				additionLabel={<i style={{ color: 'red' }}>New interest: </i>}
				onAddItem={(e, { value }: any) =>
					setInterests(interests.concat({ text: value, value }))
				}
			/>
			{(touched || modified) && error && (
				<Label basic color="red">
					{error}
				</Label>
			)}
		</Form.Field>
	);
};

export default MultiSelectInput;

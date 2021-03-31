import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { FormFieldProps, Form, Label } from 'semantic-ui-react';
import { DateTimePicker } from 'react-widgets';
import format from 'date-fns/format'

interface IProps extends FieldRenderProps<Date>, FormFieldProps {}

const DateInput: React.FC<IProps> = ({
	input,
	meta: { touched, error },
	label,
}) => {

	const maxDate = () => {
		const max = new Date();
		max.setFullYear(max.getFullYear() - 18);
		return max;
	}

	const formatDate = (value: Date) => {
		if (!value) return "";
		return format(value, 'yyyy-MM-dd');
	}

	return (
		<Form.Field error={touched && !!error}>
			<label>{label}</label>
			<DateTimePicker
				value={input.value || null}
				max={maxDate()}
				onChange={input.onChange}
				time={false}
				date={true}
				defaultCurrentDate={input.value || new Date(1990, 0, 1)}
				format={formatDate(input.value)}
			/>
			{touched && error && (
				<Label basic color="red">
					{error}
				</Label>
			)}
		</Form.Field>
	);
};

export default DateInput;

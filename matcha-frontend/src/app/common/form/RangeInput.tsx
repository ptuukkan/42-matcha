import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { FormFieldProps, Form, Label } from 'semantic-ui-react';
import Slider from 'rc-slider';

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

interface IProps
	extends FieldRenderProps<number[], HTMLElement>,
		FormFieldProps {}

const RangeInput: React.FC<IProps> = ({
	input,
	width,
	min,
	max,
	label,
	meta: { touched, error },
}) => {
	return (
		<Form.Field error={touched && !!error} width={width}>
			<label>{label}</label>
			<Form.Field>
				<Range
					min={min}
					max={max}
					defaultValue={[min, max]}
					allowCross={false}
					onChange={(data) => input.onChange(data)}
					value={input.value}
				/>
			</Form.Field>
			{touched && error && (
				<Label basic color="red">
					{error}
				</Label>
			)}
		</Form.Field>
	);
};

export default RangeInput;

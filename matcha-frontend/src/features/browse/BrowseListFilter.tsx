import React, { Fragment, useState } from 'react';
import { Header } from 'semantic-ui-react';
import Slider from 'rc-slider';

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

interface IProps {
	minValue: number;
	maxValue: number;
	name: string;
	setValue: React.Dispatch<React.SetStateAction<Number[]>>;
}

const BrowseListFilter: React.FC<IProps> = ({
	setValue,
	minValue,
	maxValue,
	name,
}) => {
	const [label, setLabel] = useState([minValue, maxValue]);

	return (
		<Fragment>
			<Header size="medium" content={name} /> {label[0]} - {label[1]}
			<Range
				max={maxValue}
				min={minValue}
				defaultValue={[minValue, maxValue]}
				allowCross={false}
				onChange={(d) => {
					setValue(d);
					setLabel(d);
				}}
			/>
		</Fragment>
	);
};

export default BrowseListFilter;

import React, { Fragment, useState } from 'react';
import { Header } from 'semantic-ui-react';
import Slider from 'rc-slider';

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

interface IProps {
	setAges: React.Dispatch<React.SetStateAction<Number[]>>;
}

const BrowseListFilter: React.FC<IProps> = ({ setAges }) => {
	return (
		<Fragment>
			<Header size="medium" content="Filter" />
			<Range
				defaultValue={[0, 100]}
				allowCross={false}
				marks={{
					0: '0',
					100: '100',
				}}
				onChange={d => setAges(d)}
			/>
		</Fragment>
	);
};

export default BrowseListFilter;

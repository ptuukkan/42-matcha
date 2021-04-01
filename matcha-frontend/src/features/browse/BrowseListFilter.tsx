import React, { Fragment, useState } from 'react';
import { Header, Input, Label } from 'semantic-ui-react';
import Slider from 'rc-slider';

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

const BrowseListFilter = () => {
	const [value, setValue] = useState(5);

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
			/>
		</Fragment>
	);
};

export default BrowseListFilter;

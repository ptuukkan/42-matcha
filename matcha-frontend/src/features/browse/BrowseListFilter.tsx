import React, { Fragment, useRef, useState } from 'react';
import { Header } from 'semantic-ui-react';
import { Range, getTrackBackground, useThumbOverlap } from 'react-range';

interface IProps {
	minValue: number;
	maxValue: number;
	name: string;
	setValue: React.Dispatch<React.SetStateAction<number[]>>;
}

const STEP = 1;
const COLORS = ['#0C2960', '#276EF1', '#9CBCF8', '#ccc'];
const THUMB_SIZE = 20;

const ThumbLabel = ({
	rangeRef,
	values,
	index,
}: {
	rangeRef: Range | null;
	values: number[];
	index: number;
}) => {
	const [labelValue, style] = useThumbOverlap(rangeRef, values, index, STEP);
	return (
		<div
			data-label={index}
			style={{
				display: 'block',
				position: 'absolute',
				top: '-20px',
				fontWeight: 'bold',
				fontSize: '14px',
				whiteSpace: 'nowrap',
				...(style as React.CSSProperties),
			}}
		>
			{labelValue}
		</div>
	);
};

const BrowseListFilter: React.FC<IProps> = ({
	setValue,
	minValue,
	maxValue,
	name,
}) => {
	const rangeRef: any = useRef<Range>();
	const [values, setValues] = useState([minValue, maxValue])

	const changeValue = (values: number[]) => {
		setValue(values);
		setValues(values);
	}

	return (
		<Fragment>
			<Header size="medium" content={name} style={{marginTop: 14}} />
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					flexWrap: 'wrap',
				}}
			>
				<Range
					values={values}
					ref={rangeRef}
					step={STEP}
					min={minValue}
					max={maxValue}
					onChange={(values) => changeValue(values)}
					renderTrack={({ props, children }) => (
						<div
							onMouseDown={props.onMouseDown}
							onTouchStart={props.onTouchStart}
							style={{
								...props.style,
								height: '36px',
								display: 'flex',
								width: '100%',
							}}
						>
							<div
								ref={props.ref}
								style={{
									height: '5px',
									width: '100%',
									borderRadius: '4px',
									background: getTrackBackground({
										values: values,
										colors: COLORS,
										min: minValue,
										max: maxValue,
									}),
									alignSelf: 'center',
								}}
							>
								{children}
							</div>
						</div>
					)}
					renderThumb={({ props, index, isDragged }) => {
						return (
							<div
								{...props}
								style={{
									...props.style,
									height: `${THUMB_SIZE}px`,
									width: `${THUMB_SIZE}px`,
									borderRadius: '4px',
									backgroundColor: '#FFF',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									boxShadow: '0px 2px 6px #AAA',
								}}
							>
								<ThumbLabel
									rangeRef={rangeRef.current}
									values={values}
									index={index}
								/>
								<div
									style={{
										height: '16px',
										width: '5px',
										backgroundColor: isDragged ? '#548BF4' : '#CCC',
									}}
								/>
							</div>
						);
					}}
				/>
			</div>
		</Fragment>
	);
};

export default BrowseListFilter;

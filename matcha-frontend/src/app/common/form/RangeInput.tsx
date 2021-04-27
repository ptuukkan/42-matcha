import * as React from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { FieldRenderProps } from 'react-final-form';
import { Range, getTrackBackground, useThumbOverlap } from 'react-range';
import { Form, FormFieldProps, Header } from 'semantic-ui-react';

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
	const rangeRef: any = useRef<Range>();
	const [values, setValues] = useState(input.value);

	const changeValue = (values: number[]) => {
		setValues(values);
		input.onChange(values)
	}

	return (
		<Form.Field error={touched && !!error} width={width}>
			<Header>{label}</Header>
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
					min={min}
					max={max}
					onChange={(values) => changeValue(values)}
					renderTrack={({ props, children }) => (
						<div
							onMouseDown={props.onMouseDown}
							onTouchStart={props.onTouchStart}
							style={{
								...props.style,
								height: '36px',
								display: 'flex',
								width: '95%',
							}}
						>
							<div
								ref={props.ref}
								style={{
									height: '5px',
									width: '100%',
									borderRadius: '4px',
									background: getTrackBackground({
										values,
										colors: COLORS,
										min: min,
										max: max,
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
		</Form.Field>
	);
};

export default RangeInput;

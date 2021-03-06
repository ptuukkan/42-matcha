import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Header, Form, Dropdown } from 'semantic-ui-react';
import TextInput from '../user/TextInput';

interface IFormValues {
	firstname: String;
	lastname: String;
	gender: String;
	sexualpreference: String;
	interests: String[];
	radius: Number;
}

const mockUpInterest = [
	{ text: 'angular', value: 'angular' },
	{ text: 'pangular', value: 'pangular' },
	{ text: 'piercing', value: 'piercing' },
];

const Profile = () => {
	/* 	const [location, setLocation] = useState('') */
	const [radius, setRadius] = useState(1);
	const [interestsList, setInterest] = useState(mockUpInterest);
	const [interests, setInterestSelect] = useState([]);
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		errors,
	} = useForm<IFormValues>({});

	useEffect(() => {
		reset({
			firstname: 'firstnameFromDatabase',
			lastname: 'lastnameFromDatabase',
			gender: '',
			sexualpreference: '',
		});
	}, [reset]);

	/* 	const getLocation = () => {
		navigator.geolocation.getCurrentPosition((position) => {
			setLocation(
				`Latitude: ${position.coords.longitude} Longitude: ${position.coords.longitude}`
			)
		})
	} */

	const handleMultiChange = (e: any, selectedOption: any) => {
		let interests = selectedOption.value;
		setValue('interests', interests);
		setInterestSelect(interests);
	};

	const handleAddition = (
		e: React.KeyboardEvent<HTMLElement>,
		{ value }: any
	) => {
		let newInterests = interestsList.concat({ text: value, value });
		setInterest(newInterests);
	};

	const handleRadius = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		setRadius(Number(e.target.value));
	};

	useEffect(() => {
		register({ name: 'interests' });
	}, [register]);

	const onSubmit = (data: any) => {
		console.log(data);
	};

	return (
		<div>
			<Header as="h1">Settings</Header>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Header>Account Settings</Header>
				<TextInput
					type="text"
					name="firstname"
					label="First name"
					errors={errors}
					register={register({
						required: 'Firstname is required',
					})}
				/>
				<TextInput
					label="Last name"
					type="text"
					name="lastname"
					errors={errors}
					register={register({
						required: 'Lastname is required',
					})}
				/>
				<Header>Preferences</Header>
				<label>Your gender</label>
				<select required name="gender" ref={register({ required: true })}>
					<option value="male">Male</option>
					<option value="female">Female</option>
					<option value="other">Other</option>
				</select>
				<label>Your sexual preference</label>
				<select
					required
					name="sexualpreference"
					ref={register({ required: true })}
				>
					<option value="male">Male</option>
					<option value="female">Female</option>
					<option value="other">Other</option>
				</select>
				<h3>Interests</h3>
				<Dropdown
					multiple
					fluid
					search
					name="interests"
					selection
					options={interestsList}
					value={interests}
					allowAdditions
					additionLabel={<i style={{ color: 'red' }}>New interest: </i>}
					onAddItem={handleAddition}
					onChange={handleMultiChange}
				></Dropdown>
				<Header as="h4">Location</Header>
				<label>Search radius: <b>{radius} km</b></label>
				<Form.Group>
					<br></br>
					<input
						type="range"
						style={{width: '100%'}}
						min={1}
						max={100}
						name="radius"
						value={radius}
						onChange={handleRadius}
						ref={register()}
					></input>
				</Form.Group>
				<Button type="submit">Save</Button>
			</Form>
		</div>
	);
};

export default Profile;

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Header, Form, Dropdown, TextArea } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { IUser } from '../../app/models/user';
import TextInput from '../user/TextInput';

const mockUpInterest = [
	{ text: 'angular', value: 'angular' },
	{ text: 'pangular', value: 'pangular' },
	{ text: 'piercing', value: 'piercing' },
];

interface IProps {
	user: IUser;
}

const Profile: React.FC<IProps> = ({ user }) => {
	/* 	const [location, setLocation] = useState('') */
	const [radius, setRadius] = useState(1);
	const [interestsList, setInterest] = useState(mockUpInterest);
	const [interests, setInterestSelect] = useState([]);
	const [biography, setBiography] = useState('');
	const { register, handleSubmit, reset, setValue, errors } = useForm({});

	useEffect(() => {
		reset({
			firstName: user['firstName'],
			lastName: user['lastName'],
			gender: '',
			sexualpreference: '',
		});
	}, [reset, user]);

	useEffect(() => {
		register({ name: 'interests' });
		register({ name: 'biography' });
	}, [register])

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

	const handleBiography = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
		{ value }: any
	) => {
		setBiography(value);
		setValue('biography', value);
	};
	const handleRadius = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		setRadius(Number(e.target.value));
	};

	const onSubmit = (data: any) => {
		agent.Profile.create(data);
	};

	return (
		<div>
			<Header as="h1">Settings</Header>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Header>Account Settings</Header>
				<TextInput
					type="text"
					name="firstName"
					label="First name"
					errors={errors}
					register={register({
						required: 'Firstname is required',
					})}
				/>
				<TextInput
					label="Last name"
					type="text"
					name="lastName"
					errors={errors}
					register={register({
						required: 'Lastname is required',
					})}
				/>
				<Header>Preferences</Header>
				<label>Your gender</label>
				<select required name="gender" ref={register({ required: true })}>
					<option value="Male">Male</option>
					<option value="Female">Female</option>
				</select>
				<label>Your sexual preference</label>
				<select
					required
					name="sexualPreference"
					ref={register({ required: true })}
				>
					<option value="Male">Male</option>
					<option value="Female">Female</option>
					<option value="Other">Other</option>
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
				<h3>Biography</h3>
				<TextArea
					placeholder="Tell us more"
					name="biography"
					value={biography}
					onChange={handleBiography}
				/>

				<Header as="h4">Location</Header>
				<label>
					Search radius: <b>{radius} km</b>
				</label>
				<Form.Group>
					<br></br>
					<input
						type="range"
						style={{ width: '100%' }}
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

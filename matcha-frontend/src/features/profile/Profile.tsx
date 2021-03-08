import { ErrorMessage } from '@hookform/error-message';
import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import {
	Button,
	Header,
	Form,
	Dropdown,
	TextArea,
	Message,
	Image,
	Divider,
} from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { IProfileFormValues } from '../../app/models/user';
import { RootStoreContext } from '../../app/stores/rootStore';
import AddPhoto from '../user/AddPhoto';
import TextInput from '../user/TextInput';

const mockUpInterest = [
	{ text: 'angular', value: 'angular' },
	{ text: 'pangular', value: 'pangular' },
	{ text: 'piercing', value: 'piercing' },
];

const Profile = () => {
	const rootStore = useContext(RootStoreContext);
	const { openProfilePhoto } = rootStore.modalStore;
	const [interestsList, setInterest] = useState(mockUpInterest);
	const [interests, setInterestSelect] = useState([]);
	const [biography, setBiography] = useState('');
	const { register, handleSubmit, reset, setValue, errors } = useForm({});

	useEffect(() => {
		reset({
			firstName: '',
			lastName: '',
			gender: '',
			sexualPreference: '',
		});
	}, [reset]);

	useEffect(() => {
		register({ name: 'interests' });
		register({ name: 'biography' });
	}, [register]);

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

	const onSubmit = (data: IProfileFormValues) => {
		agent.Profile.create(data).then();
	};

	return (
		<div>
			<Header as="h1">Settings</Header>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Header>Account Settings</Header>
				<Divider />
				<Image
					src="/placeholder.png"
					style={{ cursor: 'pointer' }}
					centered
					size="small"
					circular
					onClick={() => openProfilePhoto()}
				/>
				<Divider />
				<Header>Name</Header>
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
				<ErrorMessage
					errors={errors}
					name="gender"
					render={({ message }) => <Message negative>{message}</Message>}
				/>
				<select
					name="gender"
					ref={register({ required: 'This is required field!' })}
				>
					<option value="Male">Male</option>
					<option value="Female">Female</option>
				</select>

				<br></br>
				<label>Your sexual preference</label>
				<ErrorMessage
					errors={errors}
					name="sexualPreference"
					render={({ message }) => <Message negative>{message}</Message>}
				/>
				<select
					name="sexualPreference"
					ref={register({ required: 'This field is required' })}
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
				<Button type="submit">Save</Button>
			</Form>
			<AddPhoto />
		</div>
	);
};

export default Profile;

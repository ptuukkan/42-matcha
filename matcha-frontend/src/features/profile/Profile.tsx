/* import { ErrorMessage } from '@hookform/error-message';
import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import {
	Button,
	Header,
	Form,
	Message,
	Divider,
	Grid,
	Loader,
} from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { Gender, IProfileFormValues, SexualPreference } from '../../app/models/profile';
import AddPhoto from '../user/AddPhoto';
import ShowPhotos from '../user/ShowPhotos';
import TextInput from '../user/TextInput';
import { IProfile } from '../../app/models/profile';
import { observer } from 'mobx-react-lite';

const mockUpInterest = [
	{ text: 'angular', value: 'angular' },
	{ text: 'pangular', value: 'pangular' },
	{ text: 'piercing', value: 'piercing' },
];

const Profile = () => {
	const [interestsList, setInterest] = useState(mockUpInterest);
	const [interests, setInterestSelect] = useState<string[]>([]);
	const [sexPref, setSexPref] = useState<SexualPreference | undefined>();
	const [gender, setGender] = useState<Gender>();
	const [biography, setBiography] = useState<string | undefined>('');
	const [addPhotoMode, setAddPhotoMode] = useState(false);
	const [profile, setProfile] = useState<IProfile | null>(null)

	useEffect(() => {
		if (profile) {
			return
		}
		agent.Profile.current()
			.then((p) => {
				setProfile(p)
				setSexPref(p.sexualPreference);
				setGender(p.gender);
				setBiography(p.biography);
				setInterestSelect(p.interests);
			})
			.catch((e) => console.log(e));
	},[profile]);

	const { register, handleSubmit, setValue, errors } = useForm<IProfile>(
		{
			defaultValues: {
				firstName: profile?.firstName ?? '',
				lastName: profile?.lastName ?? '',
				biography: profile?.biography ?? '',
				gender: profile?.gender ?? undefined,
				sexualPreference: profile?.sexualPreference ?? SexualPreference.Both,
				interests: profile?.interests ?? [],
			},
		}
	);

	useEffect(() => {
		register({ name: 'interests' });
		register({ name: 'biography' });
		register({ name: 'gender' });
		register({ name: 'sexualPreference' });
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

	const onSubmit = (data: IProfileFormValues) => {
		console.log(data);
		agent.Profile.create(data).then();
	};
	if (!profile) return (<Loader/>)

	
	return (
		<div>
			<Header as="h1">Settings</Header>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Header>Account Settings</Header>
				<Form.Group widths="2">
					<TextInput
						type="text"
						name="firstName"
						label="First name"
						defaultValue={profile!.firstName}
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
				</Form.Group>
				<Form.Group widths="2">
					<ErrorMessage
						errors={errors}
						name="gender"
						render={({ message }) => <Message negative>{message}</Message>}
					/>
					<Form.Select
						label="Gender"
						value={gender}
						placeholder="Gender"
						options={[
							{ text: 'Male', value: 'Male' },
							{ text: 'Female', value: 'Female' },
						]}
						name="gender"
						onChange={(e, { value }: any) => {
							setGender(value);
							setValue('gender', value);
						}}
					></Form.Select>
					<Form.Select
						selection
						label="Sexual preference"
						value={sexPref}
						options={[
							{ text: 'Male', value: 'Male' },
							{ text: 'Female', value: 'Female' },
							{ text: 'Other', value: 'Other' },
						]}
						name="sexualPreference"
						onChange={(e, { value }: any) => {
							setSexPref(value);
							setValue('sexualPreference', value);
						}}
					></Form.Select>
					<ErrorMessage
						errors={errors}
						name="sexualPreference"
						render={({ message }) => <Message negative>{message}</Message>}
					/>
				</Form.Group>
				<Form.Select
					label="Interests"
					fluid
					multiple
					search
					name="interests"
					selection
					options={interestsList}
					value={interests}
					allowAdditions
					additionLabel={<i style={{ color: 'red' }}>New interest: </i>}
					onAddItem={handleAddition}
					onChange={handleMultiChange}
				></Form.Select>
				<Form.TextArea
					label="Biography"
					value={biography}
					placeholder="Tell us more"
					name="biography"
					onChange={(e, { value }: any) => {
						setBiography(value);
						setValue('biography', value);
					}}
				/>
				<Button type="submit">Save</Button>
			</Form>
			<Divider />
			<Grid>
				<Grid.Column width={16} style={{ paddingBottom: 0 }}>
					<Header floated="left" icon="image" content="Photos" />
					<Button
						floated="right"
						basic
						content={addPhotoMode ? 'Cancel' : 'Add Photo'}
						onClick={() => setAddPhotoMode(!addPhotoMode)}
					/>
				</Grid.Column>
				{addPhotoMode ? <AddPhoto /> : <ShowPhotos />}
			</Grid>
		</div>
	);
};

export default observer(Profile); */

export interface ProfileProps {
	
}
 
const Profile: React.FC<ProfileProps> = () => {
	return ( null );
}
 
export default Profile;
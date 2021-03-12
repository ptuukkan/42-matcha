import { Form as FinalForm, Field } from 'react-final-form';
import { Form, Button, Divider, Dimmer, Loader } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { IProfileFormValues } from '../../app/models/profile';
import TextInput from '../../app/common/form/TextInput';
import React, { useContext, useEffect, useState } from 'react';
import ShowPhotos from '../user/ShowPhotos';
import SelectInput from '../../app/common/form/SelectInput';
import MultiSelectInput from '../../app/common/form/MultiSelectInput';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import ProfilePhotos from '../user/ProfilePhotos';
import { formValidation } from './ProfileValidation';
import { IInterestOption } from '../../app/models/interest';

const gender = [
	{ key: 'female', value: 'Female', text: 'Female' },
	{ key: 'male', value: 'Male', text: 'Male' },
];

const sexualPreference = [
	{ key: 'female', text: 'Female', value: 'Female' },
	{ key: 'male', text: 'Male', value: 'Male' },
	{ key: 'other', text: 'Other', value: 'Other' },
];	

const Profile = () => {
	const [addPhotoMode, setaddPhotoMode] = useState(false);
	const rootStore = useContext(RootStoreContext);
	const { profile, loading, getProfile, removeImage, addImage, setMain, updateProfile, interests } = rootStore.profileStore;

	useEffect(() => {
		if (!profile) {
			getProfile()
				.then()
				.catch((e) => console.log(e));
		}
	}, [profile, getProfile]);

	if (loading ) return <Loader active />;

	return (
		<>
			<FinalForm
				onSubmit={updateProfile}
				initialValues={profile}
				validate={formValidation.validateForm}
				render={({ handleSubmit }) => (
					<Form onSubmit={handleSubmit} error>
						<Form.Group widths={2}>
							<Field
								component={TextInput}
								name="firstName"
								placeholder="First name"
							/>
							<Field
								component={TextInput}
								name="lastName"
								placeholder="First name"
							/>
						</Form.Group>
						<Form.Group widths={2}>
							<Field
								name="gender"
								options={gender}
								placeholder="Gender"
								component={SelectInput}
							/>
							<Field
								name="sexualPreference"
								options={sexualPreference}
								placeholder="Sexual Preference"
								component={SelectInput}
							/>
						</Form.Group>
						<Form.Group widths="equal">
							<Field
								component={MultiSelectInput}
								placeholder="interests"
								name="interests"
								options={interests}
							/>
							<Field
								component={TextInput}
								placeholder="Biography"
								name="biography"
							/>
						</Form.Group>
						<Button type="submit">Save</Button>
					</Form>
				)}
			/>
			<Divider />
			<Button
				floated="right"
				basic
				content={addPhotoMode ? 'Cancel' : 'Add Photo'}
				onClick={() => setaddPhotoMode(!addPhotoMode)}
			/>
			{addPhotoMode && profile ? (
				<ProfilePhotos photoMode={setaddPhotoMode} addImage={addImage} loading={loading} />
			) : (
				<ShowPhotos removeImage={removeImage} setMain={setMain} profile={profile} />
			)}
		</>
	);
};

export default observer(Profile);

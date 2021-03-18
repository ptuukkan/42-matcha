import React, { Fragment, useContext } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { Form, Button, Modal, Header } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import ForgotPassword from './ForgotPassword';
import TextInput from '../../app/common/form/TextInput';
import ErrorMessage from '../../app/common/form/ErrorMessage';
import { Validators } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';
import { passwordComplexity } from '../../app/common/form/validators/passwordComplexity';

const validationSchema = {
	field: {
		emailAddress: [Validators.required.validator, Validators.email.validator],
		password: [
			Validators.required.validator,
			{
				validator: passwordComplexity,
			},
		],
	},
};

const formValidation = createFinalFormValidation(validationSchema);

const Login = () => {
	const rootStore = useContext(RootStoreContext);
	const { openSubModal } = rootStore.modalStore;
	const { loginUser, loading } = rootStore.userStore;

	return (
		<FinalForm
			onSubmit={loginUser}
			validate={formValidation.validateForm}
			render={({
				handleSubmit,
				submitting,
				submitError,
				dirtySinceLastSubmit,
			}) => (
				<Form onSubmit={handleSubmit} error>
					<Header as="h2" content="Login to Matcha" />
					<Field
						component={TextInput}
						name="emailAddress"
						placeholder="Email address"
					/>
					<Field
						component={TextInput}
						type="password"
						name="password"
						placeholder="Password"
					/>
					{submitError && !dirtySinceLastSubmit && (
						<ErrorMessage message={submitError} />
					)}
					<Button
						type="submit"
						primary
						loading={submitting}
						content="Login"
						disabled={submitting}
					/>
					<Button
						type="button"
						floated="right"
						disabled={loading}
						onClick={() => openSubModal(<ForgotPassword />)}
						content="Forgot password?"
					/>
				</Form>
			)}
		/>
	);
};

export default observer(Login);

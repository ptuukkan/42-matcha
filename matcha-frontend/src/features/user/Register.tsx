import React, { useContext } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import {
	combineValidators,
	composeValidators,
	createValidator,
	hasLengthBetween,
	isAlphabetic,
	isRequired,
	matchesPattern,
} from 'revalidate';
import { Form, Button, Modal, Message } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { IRegisterFormValues } from '../../app/models/user';
import { IValidationError } from '../../app/models/errors';
import { ErrorMessage } from '@hookform/error-message';
import TextInput from '../../app/common/form/TextInput';

const Register = () => {
	const rootStore = useContext(RootStoreContext);
	const {
		registerOpen,
		closeRegister,
		registerFinishOpen,
		closeRegisterFinish,
	} = rootStore.modalStore;
	const { registerUser, loading } = rootStore.userStore;

	const onSubmit = (data: IRegisterFormValues) => {
		registerUser(data).catch((error) => {
			if (error.error_type === 'ValidationError') {
				error.errors.forEach((err: IValidationError) => {
					/* 					setError(err.field, { type: 'manual', message: err.message });
					 */
				});
			} else {
				/* 				setError('global', { type: 'manual', message: error.message });
				 */
			}
		});
	};

	const isValidEmail = createValidator(
		(message) => (value) => {
			if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i.test(value)) {
				return message;
			}
		},
		'Invalid email address'
	);

	const validate = combineValidators({
		firstName: composeValidators(
			isRequired,
			isAlphabetic,
			hasLengthBetween(2, 50)
		)('First name'),

		lastName: composeValidators(
			isRequired,
			isAlphabetic,
			hasLengthBetween(2, 50)
		)('Last name'),

		emailAddress: composeValidators(isRequired, isValidEmail)('Email address'),

		password: composeValidators(
			isRequired,
			hasLengthBetween(6, 100),
			matchesPattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)(?=.*[!@#$*?_])/)
		)('Password'),
	});

	return (
		<Modal size="tiny" open={registerOpen} onClose={closeRegister}>
			<Modal.Header>Register</Modal.Header>
			<Modal.Description />
			<Modal.Content>
				<FinalForm
					onSubmit={onSubmit}
					validate={validate}
					render={({ handleSubmit }) => (
						<Form onSubmit={handleSubmit}>
							<Field
								name="username"
								placeholder="Username"
								component={TextInput}
							/>
							<Field
								name="firstName"
								placeholder="First name"
								component={TextInput}
							/>
							<Field
								name="lastName"
								placeholder="Last name"
								component={TextInput}
							/>
							<Field
								name="emailAddress"
								placeholder="Email address"
								component={TextInput}
							/>
							<Field
								type="password"
								name="password"
								placeholder="Password"
								component={TextInput}
							/>
							<Button primary loading={loading} content="register" />
						</Form>
					)}
				/>

				<Modal open={registerFinishOpen} size="small">
					<Modal.Header>All done!</Modal.Header>
					<Modal.Content>
						<p>Confirmation email sent!</p>
						<i>Please check your email</i>
					</Modal.Content>
					<Modal.Actions>
						<Button
							primary
							icon="check"
							content="All Done"
							onClick={closeRegisterFinish}
						/>
					</Modal.Actions>
				</Modal>
			</Modal.Content>
		</Modal>
	);
};

export default observer(Register);

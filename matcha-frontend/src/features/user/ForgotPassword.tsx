import { ErrorMessage } from '@hookform/error-message';
import { observer } from 'mobx-react-lite';
import { Form as FinalForm, Field } from 'react-final-form';
import {
	combineValidators,
	composeValidators,
	createValidator,
	isRequired,
} from 'revalidate';
import React, { useContext, useState } from 'react';
import { Modal, Form, Button, Message, Input } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { BackendError } from '../../app/models/errors';
import { IForgetPassword } from '../../app/models/user';
import { RootStoreContext } from '../../app/stores/rootStore';
import TextInput from './TextInput';

const ForgotPassword = () => {
	const rootStore = useContext(RootStoreContext);
	const {
		forgetOpen,
		closeForget,
		successOpen,
		openSuccess,
		closeSuccess,
	} = rootStore.modalStore;
	const [loading, setLoading] = useState(false);

	const isValidEmail = createValidator(
		(message) => (value) => {
			if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i.test(value)) {
				return message;
			}
		},
		'Invalid email address'
	);

	const validate = combineValidators({
		email_address: composeValidators(isRequired, isValidEmail)('email_address'),
	});

	const onSubmit = (data: IForgetPassword) => {
		console.log(data)
		setLoading(true);
		agent.User.forget(data)
			.catch((error: BackendError) => {
/* 				setError('global', { type: 'manual', message: error.message });
 */			})
			.finally(() => {
				setLoading(false);
				openSuccess();
				closeForget();
			});
	};

	return (
		<>
			<Modal open={forgetOpen} onClose={closeForget}>
				<Modal.Header>Forget your password?</Modal.Header>
				<Modal.Content>
					<FinalForm
						onSubmit={onSubmit}
						validate={validate}
						render={({ handleSubmit }) => (
							<Form onSubmit={handleSubmit}>
								<Field
									name="emailAddress"
									placeholder="Email address"
									component={TextInput}
								/>
								<Button primary type="submit" loading={loading} content="Reset password" />
							</Form>
						)}
					/>
				</Modal.Content>
			</Modal>
			<Modal open={successOpen} onClose={closeSuccess}>
				<Modal.Header>Password request sended</Modal.Header>
				<Modal.Content>Please check your email!</Modal.Content>
				<Modal.Actions>
					<Button
						content="Go Back"
						labelPosition="right"
						icon="checkmark"
						onClick={closeSuccess}
						positive
					/>
				</Modal.Actions>
			</Modal>
		</>
	);
};

export default observer(ForgotPassword);

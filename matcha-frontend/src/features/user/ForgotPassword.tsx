import { observer } from 'mobx-react-lite';
import { Form as FinalForm, Field } from 'react-final-form';
import React, { useContext, useState } from 'react';
import { Modal, Form, Button, Header } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { IForgetPassword } from '../../app/models/user';
import ErrorMessage from '../../app/common/form/ErrorMessage';
import { RootStoreContext } from '../../app/stores/rootStore';
import TextInput from '../../app/common/form/TextInput';
import { FORM_ERROR } from 'final-form';
import { Validators } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';

const validationSchema = {
	field: {
		emailAddress: [Validators.required.validator, Validators.email.validator],
	},
};

const formValidation = createFinalFormValidation(validationSchema);

const ForgotPassword = () => {
	const rootStore = useContext(RootStoreContext);
	const { closeSubModal } = rootStore.modalStore;
	const [successOpen, setSuccessOpen] = useState(false);

	const onSubmit = async (data: IForgetPassword) => {
		try {
			await agent.User.forget(data);
			setSuccessOpen(true);
		} catch (error) {
			return { [FORM_ERROR]: error.message };
		}
	};

	return (
		<>
			<FinalForm
				onSubmit={onSubmit}
				validate={formValidation.validateForm}
				render={({
					handleSubmit,
					submitError,
					dirtySinceLastSubmit,
					submitting,
				}) => (
					<Form onSubmit={handleSubmit} error>
						<Header as="h2" content="Forgot your password?" />
						<Field
							component={TextInput}
							name="emailAddress"
							placeholder="Email address"
						/>
						{submitError && !dirtySinceLastSubmit && (
							<ErrorMessage message={submitError} />
						)}
						<Button primary loading={submitting} content="Send" />
					</Form>
				)}
			/>
			<Modal size="tiny" open={successOpen}>
				<Modal.Header>Password request sended</Modal.Header>
				<Modal.Content>Please check your email!</Modal.Content>
				<Modal.Actions>
					<Button
						content="Go Back"
						labelPosition="right"
						icon="checkmark"
						onClick={() => {
							setSuccessOpen(false);
							closeSubModal();
						}}
						positive
					/>
				</Modal.Actions>
			</Modal>
		</>
	);
};

export default observer(ForgotPassword);

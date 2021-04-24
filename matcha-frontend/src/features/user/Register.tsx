import React, { Fragment, useContext, useState } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { Form, Button, Modal, Header } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import TextInput from '../../app/common/form/TextInput';
import ErrorMessage from '../../app/common/form/ErrorMessage';
import { formValidation } from './RegisterValidation';

const Register = () => {
	const rootStore = useContext(RootStoreContext);
	const { registerUser } = rootStore.userStore;
	const { closeModal } = rootStore.modalStore;
	const [successOpen, setSuccessOpen] = useState(true);

	return (
		<Fragment>
			<FinalForm
				onSubmit={registerUser}
				validate={formValidation.validateForm}
				render={({
					handleSubmit,
					submitting,
					submitError,
					submitSucceeded,
					dirtySinceLastSubmit,
				}) => (
					<Form onSubmit={handleSubmit} error>
						<Header as="h2" content="Register" />
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
						{submitError && !dirtySinceLastSubmit && (
							<ErrorMessage message={submitError} />
						)}
						<Button primary loading={submitting} content="Register" />
						<Modal open={submitSucceeded && successOpen} size="small">
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
									onClick={() => {
										setSuccessOpen(false);
										closeModal();
									}}
								/>
							</Modal.Actions>
						</Modal>
					</Form>
				)}
			/>
		</Fragment>
	);
};

export default observer(Register);

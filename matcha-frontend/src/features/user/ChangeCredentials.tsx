import { Form as FinalForm, Field } from 'react-final-form';
import { Button, Form, Header, Modal } from 'semantic-ui-react';
import ErrorMessage from '../../app/common/form/ErrorMessage';
import TextInput from '../../app/common/form/TextInput';
import { formValidation } from './ChangeCredentialsValidation';
import { observer } from 'mobx-react-lite';
import { useContext, useState } from 'react';
import { RootStoreContext } from '../../app/stores/rootStore';

const ChangeCredentials = () => {
	const rootStore = useContext(RootStoreContext);
	const { changeCredentials } = rootStore.userStore;
	const [successOpen, setSuccessOpen] = useState(true);

	return (
		<div>
			<Header>Change credentials</Header>
			<FinalForm
				onSubmit={changeCredentials}
				validate={formValidation.validateForm}
				render={({
					handleSubmit,
					submitting,
					submitSucceeded,
					submitError,
					dirtySinceLastSubmit,
				}) => (
					<Form onSubmit={handleSubmit} error>
						<Field
							component={TextInput}
							name="emailAddress"
							placeholder="Email address"
						/>
						<Field
							component={TextInput}
							type="password"
							name="password"
							placeholder="New Password"
						/>
						<Button content="Save" loading={submitting} disabled={submitting} />
						{submitError && !dirtySinceLastSubmit && (
							<ErrorMessage message={submitError} />
						)}
						<Modal size="tiny" open={submitSucceeded && successOpen} closeOnDimmerClick>
							<Modal.Header>Success</Modal.Header>
							<Modal.Actions>
								<Button
									content="Go Back"
									labelPosition="right"
									icon="checkmark"
									onClick={() => {
										setSuccessOpen(false);
									}}
									positive
								/>
							</Modal.Actions>
						</Modal>
					</Form>
				)}
			/>
		</div>
	);
};

export default observer(ChangeCredentials);

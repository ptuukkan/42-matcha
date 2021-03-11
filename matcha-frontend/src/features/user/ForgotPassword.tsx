import { observer } from 'mobx-react-lite';
import { Form as FinalForm, Field } from 'react-final-form';
import { useContext } from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
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
	const {
		forgetOpen,
		closeForget,
		successOpen,
		openSuccess,
		closeSuccess,
	} = rootStore.modalStore;

	const onSubmit = async (data: IForgetPassword) => {
		try {
			await agent.User.forget(data);
			openSuccess();
			closeForget();
		} catch (error) {
			return { [FORM_ERROR]: error.message };
		}
	};

	return (
		<>
			<Modal size="tiny" open={forgetOpen} onClose={closeForget}>
				<Modal.Header>Forget your password?</Modal.Header>
				<Modal.Content>
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
				</Modal.Content>
			</Modal>
			<Modal size="tiny" open={successOpen} onClose={closeSuccess}>
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

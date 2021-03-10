import { Fragment, useContext } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { Form, Button, Modal } from 'semantic-ui-react';
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
	const { loginOpen, closeLogin, openForget } = rootStore.modalStore;
	const { loginUser, loading } = rootStore.userStore;

	return (
		<Fragment>
			<Modal size="mini" open={loginOpen} onClose={closeLogin}>
				<Modal.Header>Login to Matcha</Modal.Header>
				<Modal.Content>
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
								<Button type="submit" primary loading={submitting} content="Login" />
								<Button
									type="button"
									floated="right"
									disabled={loading}
									onClick={openForget}
									content="Forgot password?"
								/>
							</Form>
						)}
					/>
					<ForgotPassword />
				</Modal.Content>
			</Modal>
		</Fragment>
	);
};

export default observer(Login);

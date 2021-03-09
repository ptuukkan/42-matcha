import { Fragment, useContext } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { combineValidators, isRequired } from 'revalidate';
import { Form, Button, Modal } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { ILoginFormValues } from '../../app/models/user';
import ForgotPassword from './ForgotPassword';
import TextInput from '../../app/common/form/TextInput';
import { FORM_ERROR } from 'final-form';
import ErrorMessage from '../../app/common/form/ErrorMessage';

const validate = combineValidators({
	emailAddress: isRequired('Email '),
	password: isRequired('Password '),
});

const Login = () => {
	const rootStore = useContext(RootStoreContext);
	const { loginOpen, closeLogin, openForget } = rootStore.modalStore;
	const { loginUser, loading } = rootStore.userStore;

	return (
		<Fragment>
			<Modal size="tiny" open={loginOpen} onClose={closeLogin}>
				<Modal.Header>Login to Matcha</Modal.Header>
				<Modal.Content>
					<FinalForm
						onSubmit={(data: ILoginFormValues) =>
							loginUser(data).catch((error) => ({
								[FORM_ERROR]: error.message,
							}))
						}
						validate={validate}
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
								<Button primary loading={submitting} content="Login" />
								<Button
									type="button"
									floated="right"
									disabled={loading}
									onClick={() => openForget()}
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

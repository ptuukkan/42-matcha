import React, { Fragment, useContext } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { combineValidators, isRequired } from 'revalidate';
import { Form, Message, Button, Modal, Input } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { ILoginFormValues } from '../../app/models/user';
import { BackendError } from '../../app/models/errors';
import ForgotPassword from './ForgotPassword';
import { useHistory } from 'react-router-dom';
import TextInput from './TextInput';

const validate = combineValidators({
	emailAddress: isRequired('Email '),
	password: isRequired('Password '),
});

const Login = () => {
	const rootStore = useContext(RootStoreContext);
	const { loginOpen, closeLogin, openForget } = rootStore.modalStore;
	const { loginUser, loading } = rootStore.userStore;
	const history = useHistory();

	return (
		<Fragment>
			<Modal
				size="tiny"
				open={loginOpen}
				onClose={() => {
					closeLogin();
				}}
			>
				<Modal.Header>Login to Matcha</Modal.Header>
				<Modal.Content>
					<FinalForm
						onSubmit={(data) =>
							loginUser(data)
								.then(() => {
									history.push('/');
								})
								.catch((e) => console.log(e))
						}
						validate={validate}
						render={({ handleSubmit }) => (
							<Form onSubmit={handleSubmit}>
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
								<Button primary loading={loading} content="Login" />
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

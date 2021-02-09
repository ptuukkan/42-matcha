import React, { useContext } from 'react';
import { Form, Message, Button, Modal } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { ILoginFormValues } from '../../app/models/user';
import TextInput from './TextInput';
import { BackendError } from '../../app/models/errors';
import { ErrorMessage } from '@hookform/error-message';

const Login = () => {
	const rootStore = useContext(RootStoreContext);
	const { loginOpen, closeLogin } = rootStore.modalStore;
	const { loginUser, loading } = rootStore.userStore;
	const { register, handleSubmit, errors, setError, reset } = useForm();

	const onSubmit = (data: ILoginFormValues) => {
		loginUser(data).catch((error: BackendError) => {
			setError('global', { type: 'manual', message: error.message });
		});
	};

	return (
		<Modal size="tiny" open={loginOpen} onClose={()=> {
			closeLogin()
			reset()
		}}>
			<Modal.Header>Login to Matcha</Modal.Header>
			<Modal.Content>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<TextInput
						type="text"
						name="emailAddress"
						label="Email address"
						errors={errors}
						register={register({
							required: 'Email address is required',
							pattern: {
								value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
								message: 'Email is not valid',
							},
						})}
					/>
					<TextInput
						type="password"
						name="password"
						label="Password"
						errors={errors}
						register={register({
							required: 'Password is required',
						})}
					/>
					<ErrorMessage
						errors={errors}
						name="global"
						render={({ message }) => <Message negative>{message}</Message>}
					/>
					<Button primary type="submit" loading={loading}>
						Login
					</Button>
				</Form>
			</Modal.Content>
		</Modal>
	);
};

export default observer(Login);

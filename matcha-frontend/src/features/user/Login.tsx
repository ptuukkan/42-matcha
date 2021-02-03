import React, { useContext } from 'react';
import { Form, Message, Button, Modal } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { ILoginFormValues } from '../../app/models/user';
import TextInput from './TextInput';

const Login = () => {
	const rootStore = useContext(RootStoreContext);
	const { loginOpen, closeLogin } = rootStore.modalStore;
	const { loginUser } = rootStore.userStore;
	const { register, handleSubmit, errors } = useForm();

	const onSubmit = (data: ILoginFormValues) => {
		loginUser(data);
	};

	return (
		<Modal size="tiny" open={loginOpen} onClose={closeLogin}>
			<Modal.Header>Login to Matcha</Modal.Header>
			<Modal.Content>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<TextInput
						type="text"
						name="username"
						label="Username"
						errors={errors}
						register={register({
							required: 'Username is required',
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
					<Button primary type="submit">Login</Button>
				</Form>
			</Modal.Content>
		</Modal>
	);
};

export default observer(Login);

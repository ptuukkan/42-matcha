import React, { useContext } from 'react';
import { Form, Message, Button, Modal } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { ILoginFormValues } from '../../app/models/user';

const Login = () => {
	const rootStore = useContext(RootStoreContext);
	const { loginOpen, closeLoginModal } = rootStore.modalStore;
	const { loginUser } = rootStore.userStore;
	const { register, handleSubmit, errors } = useForm();

	const onSubmit = (data: ILoginFormValues) => {
		loginUser(data);
	};

	return (
		<Modal open={loginOpen} onClose={closeLoginModal}>
			<Modal.Header>Login to Matcha</Modal.Header>
			<Modal.Content>
				<Form onSubmit={handleSubmit(onSubmit)}>
					{errors.email && <Message negative>{errors.email.message}</Message>}
					{errors.password && (
						<Message negative>{errors.password.message}</Message>
					)}
					<Form.Group widths={2}>
						<Form.Field>
							<label>username</label>
							<input
								type="text"
								name="username"
								placeholder="username"
								ref={register({
									required: 'Username is required',
								})}
							/>
						</Form.Field>
						<Form.Field>
							<label>password</label>
							<input
								type="password"
								name="password"
								placeholder="password"
								ref={register({
									required: 'Password is required',
								})}
							/>
						</Form.Field>
					</Form.Group>
					<Button type="submit">Login</Button>
				</Form>
				<br></br>
			</Modal.Content>
		</Modal>
	);
};

export default observer(Login);

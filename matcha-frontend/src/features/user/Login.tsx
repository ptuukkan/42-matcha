import React, { useContext } from 'react';
import { Form, Message, Button, Modal } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';

const Login = () => {
	const rootStore = useContext(RootStoreContext);
	const { loginOpen, closeLoginModal } = rootStore.modalStore;
	const { register, handleSubmit, errors, formState } = useForm();

	const onSubmit = (data: any) => {
		console.log(data);
		if (formState.isSubmitted) {
			console.log('Redirect to success page');
		}
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
							<label>email</label>
							<input
								type="text"
								name="email"
								placeholder="email"
								ref={register({
									required: 'Email is required',
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

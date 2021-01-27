import React, { useContext } from 'react';
import { Form, Message, Button, Modal } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { IRegisterFormValues } from '../../app/models/user';

const Register = () => {
	const rootStore = useContext(RootStoreContext);
	const { registerOpen, closeRegisterModal } = rootStore.modalStore;
	const {
		secondOpen,
		setSecondClose,
		registerUser,
	} = rootStore.userStore;
	const { register, handleSubmit, errors } = useForm();

	const onSubmit = (data: IRegisterFormValues) => {
		registerUser(data);
	};

	const validatePassword = (value: string) => {
		if (value.length < 6) {
			return 'Password should be at-least 6 characters.';
		} else if (
			!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)(?=.*[!@#$*?_])/.test(value)
		) {
			return 'Password should contain at least one uppercase letter, lowercase letter, digit, and special symbol.';
		}
		return true;
	};

	return (
		<Modal open={registerOpen} onClose={closeRegisterModal}>
			<Modal.Header>Register</Modal.Header>
			<Modal.Description />
			<Modal.Content>
				<Form onSubmit={handleSubmit(onSubmit)}>
					{errors.username && (
						<Message negative>{errors.username.message}</Message>
					)}
					{errors.firstname && (
						<Message negative>{errors.firstname.message}</Message>
					)}
					{errors.lastname && (
						<Message negative>{errors.lastname.message}</Message>
					)}
					{errors.email && (
						<Message negative>{errors.email.message}</Message>
					)}
					{errors.password && (
						<Message negative>{errors.password.message}</Message>
					)}

					<label>Username:</label>
					<input
						type="text"
						name="username"
						placeholder="Username"
						ref={register({
							required: 'Username is required',
						})}
					/>

					<label>Firstname:</label>
					<input
						type="text"
						name="firstname"
						placeholder="Firstname"
						ref={register({
							required: 'Firstname is required',
						})}
					/>

					<label>Lastname:</label>
					<input
						type="text"
						name="lastname"
						placeholder="Lastname"
						ref={register({
							required: 'Lastname is required',
						})}
					/>
					<label>Email:</label>
					<input
						type="text"
						name="email"
						placeholder="email"
						ref={register({
							required: 'Email is required',
							pattern: {
								value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
								message: 'Email is not valid',
							},
						})}
					/>
					<label>Password:</label>
					<input
						type="password"
						name="password"
						placeholder="password"
						ref={register({
							required: 'Password is required',
							validate: validatePassword,
						})}
					/>
					<br></br>
					<Button type="submit">Register</Button>
				</Form>
				<Modal
					onClose={() => setSecondClose()}
					open={secondOpen}
					size="small"
				>
					<Modal.Header>All done!</Modal.Header>
					<Modal.Content>
						<p>Confirmation email sent!</p>
						<i>Please check your email</i>
					</Modal.Content>
					<Modal.Actions>
						<Button
							icon="check"
							content="All Done"
							onClick={() => setSecondClose()}
							as={Link}
							to="/"
						/>
					</Modal.Actions>
				</Modal>
			</Modal.Content>
		</Modal>
	);
};

export default observer(Register);
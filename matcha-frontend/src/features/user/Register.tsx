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
		setSecondOpen,
		registerUser,
	} = rootStore.userStore;
	const { register, handleSubmit, errors, setError } = useForm();

	const onSubmit = (data: IRegisterFormValues) => {
		registerUser(data)
			.then(() => setSecondOpen())
			.catch((error) => {
				error.response.data.errors.forEach((err: any) => {
					setError(err.field, { type: 'manual', message: err.error });
				});
			});
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
		<Modal size="tiny" open={registerOpen} onClose={closeRegisterModal}>
			<Modal.Header>Register</Modal.Header>
			<Modal.Description />
			<Modal.Content>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<label>Username:</label>
					<input
						type="text"
						name="userName"
						placeholder="Username"
						ref={register({
							required: 'Username is required',
						})}
					/>
					{errors.userName && (
						<Message negative>{errors.userName.message}</Message>
					)}

					<label>Firstname:</label>
					<input
						type="text"
						name="firstName"
						placeholder="Firstname"
						ref={register({
							required: { value: true, message: 'Firstname is required' },
						})}
					/>
					{errors.firstName && (
						<Message negative>{errors.firstName.message}</Message>
					)}

					<label>Lastname:</label>
					<input
						type="text"
						name="lastName"
						placeholder="Lastname"
						ref={register({
							required: 'Lastname is required',
						})}
					/>
					{errors.lastName && (
						<Message negative>{errors.lastName.message}</Message>
					)}
					<label>Email:</label>
					<input
						type="text"
						name="emailAddress"
						placeholder="email"
						ref={register({
							required: 'Email is required',
							pattern: {
								value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
								message: 'Email is not valid',
							},
						})}
					/>
					{errors.emailAddress && (
						<Message negative>{errors.emailAddress.message}</Message>
					)}
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
					{errors.password && (
						<Message negative>{errors.password.message}</Message>
					)}
					<br />
					<br />
					<Button primary type="submit">
						Register
					</Button>
				</Form>
				<Modal open={secondOpen} size="small">
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

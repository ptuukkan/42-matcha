import React, { useContext } from 'react';
import { Form, Message, Button, Modal } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { IForgetPassword, ILoginFormValues } from '../../app/models/user';
import TextInput from './TextInput';
import { BackendError } from '../../app/models/errors';
import { ErrorMessage } from '@hookform/error-message';
import { useHistory } from 'react-router-dom';

const Login = () => {
	const rootStore = useContext(RootStoreContext);
	const {
		loginOpen,
		closeLogin,
		forgetOpen,
		closeForget,
		openForget,
	} = rootStore.modalStore;
	const { loginUser, forgetPassword,loading } = rootStore.userStore;
	const {
		register,
		handleSubmit,
		errors,
		setError,
		reset,
		clearErrors,
	} = useForm();
	const history = useHistory();
	
	const {
		register: forgetRegister,
		handleSubmit: forgetHandle,
		errors: forgetErrors,
	} = useForm();

	const submitForget = (data: IForgetPassword) => {
		forgetPassword(data);
		console.log(data)
	}

	const onSubmit = (data: ILoginFormValues) => {
		loginUser(data)
			.then(() => {
				history.push('/');
			})
			.catch((error: BackendError) => {
				setError('global', { type: 'manual', message: error.message });
			});
	};

	return (
		<Modal
			size="tiny"
			open={loginOpen}
			onClose={() => {
				closeLogin();
				reset();
			}}
		>
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
					<Button
						primary
						type="submit"
						loading={loading}
						onClick={() => clearErrors()}
					>
						Login
					</Button>
					<Button
						floated="right"
						loading={loading}
						onClick={() => openForget()}
					>
						Forgot password?
					</Button>
					<Modal open={forgetOpen} onClose={closeForget}>
						<Modal.Header>Forget your password?</Modal.Header>
						<Modal.Content>
							<Form onSubmit={forgetHandle(submitForget)}>
								<TextInput
									type="text"
									name="emailAddress"
									label="Email address"
									errors={forgetErrors}
									register={forgetRegister({
										required: 'Email address is required',
										pattern: {
											value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
											message: 'Email is not valid',
										},
									})}
								/>
								<Button
									primary
									type="submit"
									loading={loading}
								>
									Reset password
								</Button>
							</Form>
						</Modal.Content>
					</Modal>
				</Form>
			</Modal.Content>
		</Modal>
	);
};

export default observer(Login);

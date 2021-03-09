import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import { Form, Header, Message, Button, Input } from 'semantic-ui-react';
import TextInput from '../../app/common/form/TextInput';
import agent from '../../app/api/agent';
import { BackendError } from '../../app/models/errors';
import { IResetPassword } from '../../app/models/user';
import React, { useState } from 'react';

interface IParams {
	link: string;
}

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

const ChangePassword = () => {
	const { register, handleSubmit, errors, setError, clearErrors } = useForm();
	const [loading, setLoading] = useState(false);
	const [finish, setFinish] = useState(false);
	const { link } = useParams<IParams>();

	const onSubmit = (data: IResetPassword) => {
		setLoading(true);
		agent.User.reset(link, data)
			.catch((error: BackendError) => {
				setError('global', { type: 'manual', message: error.message });
			})
			.finally(() => {
				setLoading(false);
				setFinish(true);
			});
	};

	if (finish) return <Header>Password successfully changed!</Header>;

	return (
		<div>
			<Header>Reset your password</Header>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Input
					type="password"
					name="password"
					label="Password"
					errors={errors}
					register={register({
						required: 'Password is required',
						validate: validatePassword,
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
					content="Reset password"
					onClick={() => clearErrors()}
				/>
			</Form>
		</div>
	);
};

export default ChangePassword;

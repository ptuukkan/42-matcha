import { useParams } from 'react-router-dom';
import { Form, Header, Button, Grid } from 'semantic-ui-react';
import TextInput from '../../app/common/form/TextInput';
import { Form as FinalForm, Field } from 'react-final-form';
import agent from '../../app/api/agent';
import { IResetPassword } from '../../app/models/user';
import { useState } from 'react';
import { Validators } from '@lemoncode/fonk';
import ErrorMessage from '../../app/common/form/ErrorMessage';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';
import { passwordComplexity } from '../../app/common/form/validators/passwordComplexity';
import { FORM_ERROR } from 'final-form';

interface IParams {
	link: string;
}

const validationSchema = {
	field: {
		password: [
			Validators.required.validator,
			{
				validator: passwordComplexity,
			},
		],
	},
};

const formValidation = createFinalFormValidation(validationSchema);

const ChangePassword = () => {
	const [finish, setFinish] = useState(false);
	const { link } = useParams<IParams>();

	const onSubmit = async (data: IResetPassword) => {
		try {
			await agent.User.reset(link, data);
			setFinish(true);
		} catch (error) {
			return { [FORM_ERROR]: error.message };
		}
	};

	if (finish) return <Header>Password successfully changed!</Header>;

	return (
		<Grid centered>
			<Grid.Column>
				<Header>Reset your password</Header>
				<FinalForm
					onSubmit={onSubmit}
					validate={formValidation.validateForm}
					render={({
						handleSubmit,
						submitError,
						dirtySinceLastSubmit,
						submitting,
					}) => (
						<Form onSubmit={handleSubmit} error>
							<Field
								type="password"
								name="password"
								placeholder="Password"
								component={TextInput}
							/>
							{submitError && !dirtySinceLastSubmit && (
								<ErrorMessage message={submitError} />
							)}
							<Button primary loading={submitting} content="Reset password" />
						</Form>
					)}
				/>
			</Grid.Column>
		</Grid>
	);
};

export default ChangePassword;

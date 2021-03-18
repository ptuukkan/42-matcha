import { Form as FinalForm, Field } from 'react-final-form';
import { Button, Form, Header, Modal } from 'semantic-ui-react';
import ErrorMessage from '../../app/common/form/ErrorMessage';
import TextInput from '../../app/common/form/TextInput';
import { formValidation } from './ChangeCredentialsValidation';
import { observer } from 'mobx-react-lite';


const ChangeCredentials = () => {

	return (
		<div>
			<Header>Change credentials</Header>
			<FinalForm
				onSubmit={(data) => console.log(data)}
				validate={formValidation.validateForm}
				render={({
					handleSubmit,
					submitting,
					submitError,
					dirtySinceLastSubmit,
				}) => (
					<Form onSubmit={handleSubmit} error>
						<Field
							component={TextInput}
							name="emailAddress"
							placeholder="Email address"
						/>
						<Field
							component={TextInput}
							type="password"
							name="password"
							placeholder="New Password"
						/>
						<Button content="Save" loading={submitting} disabled={submitting} />
						{submitError && !dirtySinceLastSubmit && (
							<ErrorMessage message={submitError} />
						)}
					</Form>
				)}
			/>
		</div>
	);
};

export default observer(ChangeCredentials);
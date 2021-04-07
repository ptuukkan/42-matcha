import React, { useState } from 'react';
import { Button, Form, Popup } from 'semantic-ui-react';
import { Form as FinalForm, Field } from 'react-final-form';
import ErrorMessage from '../../app/common/form/ErrorMessage';
import TextInput from '../../app/common/form/TextInput';
import { IReportFormData } from '../../app/models/profile';
import agent from '../../app/api/agent';

interface IProps {
	id: string;
}

const ReportProfile: React.FC<IProps> = ({ id }) => {
	const [done, setDone] = useState(false);

	return (
		<Popup
			wide
			on="click"
			content={
				done ? (
					<div>User Reported</div>
				) : (
					<FinalForm
						onSubmit={(data: IReportFormData) =>
							agent.Profile.report(id, data)
								.then()
								.catch((e) => console.log(e))
						}
						render={({
							handleSubmit,
							submitting,
							submitError,
							dirtySinceLastSubmit,
						}) => (
							<Form onSubmit={handleSubmit} error>
								<Field
									component={TextInput}
									name="reason"
									placeholder="Reason"
								/>
								{submitError && !dirtySinceLastSubmit && (
									<ErrorMessage message={submitError} />
								)}

								<Button
									primary
									onClick={() => setDone(true)}
									floated="right"
									content="Send"
									loading={submitting}
									disabled={submitting}
									style={{ marginBottom: '10px' }}
								/>
							</Form>
						)}
					/>
				)
			}
			trigger={
				<Button floated="right" size="tiny" color="black">
					Report fake user
				</Button>
			}
		/>
	);
};

export default ReportProfile;

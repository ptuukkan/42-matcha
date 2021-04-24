import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import agent from '../../app/api/agent';
import { Message } from 'semantic-ui-react';
import { IBackendError } from '../../app/models/errors';

interface IParams {
	link: string;
}

const EmailVerification = () => {
	const [message, setMessage] = useState<string | null>(null);
	const [status, setStatus] = useState(false)
	const { link } = useParams<IParams>();

	useEffect(() => {
		agent.User.verify(link)
			.then(() => {
				setMessage('Email verificated');
				setStatus(true);
			})
			.catch((error: IBackendError) => {
				setMessage(error.message);
				setStatus(false);
			});
	}, [link]);

	return (
		<>
		{status && message && (<Message positive content={message} />)}
		{!status && message && (<Message negative content={message} />)}
		</>

	)
};

export default EmailVerification;

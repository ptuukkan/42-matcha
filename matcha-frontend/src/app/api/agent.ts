import axios, { AxiosResponse } from 'axios';
import { BackendError } from '../models/errors';
import { ILoginFormValues, IRegisterFormValues } from '../models/user';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.response.use(undefined, (error) => {
	if (error.message === 'Network Error' && !error.response) {
		const e = new BackendError('Network Error');
		throw e;
	}
	if (error.response && error.response.data) {
		throw error.response.data;
	}
	throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
	post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
};

const User = {
	register: (user: IRegisterFormValues): Promise<void> =>
		requests.post('/user/register', user),
	login: (user: ILoginFormValues): Promise<void> =>
		requests.post('/user/login', user),
};

const agent = {
	User,
};

export default agent;

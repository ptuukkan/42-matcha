import axios, { AxiosResponse } from 'axios';
import { BackendError } from '../models/errors';
import { ILoginFormValues, IRegisterFormValues, IUser } from '../models/user';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(
	(config) => {
		const token = window.localStorage.getItem('jwt');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

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
	get: (url: string) => axios.get(url).then(responseBody),
	post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
};

const User = {
	register: (user: IRegisterFormValues): Promise<void> =>
		requests.post('/user/register', user),
	login: (user: ILoginFormValues): Promise<string> =>
		requests.post('/user/login', user),
	current: (): Promise<IUser> => requests.get('/user/current'),
};

const agent = {
	User,
};

export default agent;

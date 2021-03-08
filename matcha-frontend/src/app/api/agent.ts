import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { BackendError } from '../models/errors';
import {
	IForgetPassword,
	ILoginFormValues,
	IRegisterFormValues,
	IResetPassword,
	IUser,
	IProfileFormValues,
} from '../models/user';
import { history } from '../..';

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
	const { status, data } = error.response;
	if (status === 401 && data.message === 'Token expired') {
		console.log(error.response);
		window.localStorage.removeItem('jwt');
		history.push('/');
		toast.error('Your session has expired, please login again');
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
	put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
};

const User = {
	register: (user: IRegisterFormValues): Promise<void> =>
		requests.post('/user/register', user),
	login: (user: ILoginFormValues): Promise<IUser> =>
		requests.post('/user/login', user),
	current: (): Promise<IUser> => requests.get('/user/current'),
	verify: (link: string): Promise<void> => requests.get(`/user/verify/${link}`),
	forget: (data: IForgetPassword): Promise<void> =>
		requests.post(`/user/password/reset`, data),
	reset: (link: string, data: IResetPassword): Promise<void> =>
		requests.post(`/user/password/reset/${link}`, data),
};

const Profile = {
	create: (data: IProfileFormValues): Promise<void> => requests.put('/profile', data),
	addImage: (data: FormData): Promise<void> => requests.post('/profile/image', data)
};

const Image = {
	get: (id: string): Promise<string> => requests.get(`/image/${id}`)
}

const agent = {
	User,
	Profile,
	Image,
};

export default agent;

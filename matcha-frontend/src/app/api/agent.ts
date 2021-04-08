import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { BackendError } from '../models/errors';
import {
	IForgetPassword,
	ILoginFormValues,
	IRegisterFormValues,
	IResetPassword,
	ICredentialFormValues,
	IUser,
} from '../models/user';
import { history } from '../..';
import {
	IImage,
	ILikeResponse,
	ILocation,
	IPrivateProfile,
	IProfileFormValues,
	IPublicProfile,
	IReportFormData,
} from '../models/profile';
import { IInterestOption } from '../models/interest';
import { IResearchFormValues } from '../models/research';

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
	if (error.response) {
		const { status, data } = error.response;
		if (status === 401 && data.message === 'Token expired') {
			console.log(error.response);
			window.localStorage.removeItem('jwt');
			history.push('/');
			toast.error('Your session has expired, please login again');
		}
		if (error.response.data) {
			throw error.response.data;
		}
		throw error.response;
	}
	throw error;
});

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
	get: (url: string) => axios.get(url).then(responseBody),
	delete: (url: string) => axios.delete(url).then(responseBody),
	post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
	put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
};

const User = {
	register: (user: IRegisterFormValues): Promise<void> =>
		requests.post('/user/register', user),
	login: (user: ILoginFormValues): Promise<IUser> =>
		requests.post('/user/login', user),
	current: (location: ILocation): Promise<IUser> =>
		requests.post('/user/current', location),
	verify: (link: string): Promise<void> => requests.get(`/user/verify/${link}`),
	forget: (data: IForgetPassword): Promise<void> =>
		requests.post(`/user/password/reset`, data),
	credentials: (data: ICredentialFormValues): Promise<void> =>
		requests.post(`/user/credentials`, data),
	reset: (link: string, data: IResetPassword): Promise<void> =>
		requests.post(`/user/password/reset/${link}`, data),
};

const Profile = {
	update: (data: IProfileFormValues): Promise<void> =>
		requests.put('/profile', data),
	addImage: (data: FormData): Promise<IImage> =>
		requests.post('/profile/image', data),
	current: (): Promise<IPrivateProfile> => requests.get('/profile'),
	get: (id: string): Promise<IPublicProfile> => requests.get(`/profile/${id}`),
	removeImage: (id: string): Promise<void> =>
		requests.delete(`/profile/image/${id}`),
	imageToMain: (id: string): Promise<void> =>
		requests.put(`/profile/image/${id}`, {}),
	like: (id: string): Promise<ILikeResponse> =>
		requests.get(`/profile/${id}/like`),
	unlike: (id: string): Promise<void> => requests.delete(`/profile/${id}/like`),
	report: (id: string, data: IReportFormData): Promise<void> =>
		requests.post(`/profile/${id}/report`, data),
	block: (id: string): Promise<void> => requests.get(`/profile/${id}/block`),
	unblock: (id: string): Promise<void> =>
		requests.delete(`/profile/${id}/block`),
};

const Location = {
	get: (): Promise<ILocation> => requests.get('https://ipapi.co/json/'),
};

const Browse = {
	list: (): Promise<IPublicProfile[]> => requests.get('/browse/list'),
	list_all: (): Promise<IPublicProfile[]> => requests.get('/browse/list_all'),
};

const Research = {
	list: (values: IResearchFormValues): Promise<IPublicProfile[]> =>
		requests.post('/research/list', values),
};

const Matches = {
	list: (): Promise<IPublicProfile[]> => requests.get('/matches'),
};

const Interests = {
	get: (): Promise<IInterestOption[]> => requests.get('/interests'),
};

const agent = {
	User,
	Profile,
	Interests,
	Location,
	Browse,
	Research,
	Matches,
};

export default agent;

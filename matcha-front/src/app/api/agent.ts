import axios, { AxiosResponse } from "axios";
import { IRegisterFormValues } from "../models/user";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
	post: (url: string, body: {}) => axios.post(url, body)
		.then(responseBody),
}

const User = {
	register: (user: IRegisterFormValues): Promise<void> => requests.post('/user/register', user),
}

const agent = {
	User,
};

export default agent;

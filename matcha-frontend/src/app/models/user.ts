import { StringMappingType } from "typescript";

export interface IUser {
	firstName: string;
	lastName: string;
	emailAddress: string;
	username: string;
	token: string;
	hasProfile: boolean
}

export interface IProfile {
	firstName: string,
	lastName: string,
	gender: string,
	sexualPreference: string,
	biography: string,
	interests: string[],
	pictures: string[],
	profilePhoto: string,
}

export interface IRegisterFormValues {
	emailAddress: string,
	username: string,
	firstName: string,
	lastName: string,
	password: string,
	confirmPassword: string
}

export interface ILoginFormValues {
	username: string,
	password: string
}

export interface IResetPassword {
	password: string
}

export interface IForgetPassword {
	email: string
}

export interface IUser {
	emailAddress: string;
	token: string;
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

export interface ICredentialFormValues {
	username: string,
	password: string
}

export interface IResetPassword {
	password: string
}

export interface IForgetPassword {
	email: string
}

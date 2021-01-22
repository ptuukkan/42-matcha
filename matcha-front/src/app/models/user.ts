export interface IUser {
	firstName: string;
	lastName: string;
	emailAddress: string;
	birthday: Date;
	sexualPreference: SexualPreference;
	gender: Gender;
	biography: string;
	fameRating: number;
	location: ILocation;
	interests: string[];
	pictures: IPicture[];
}

export interface ILocation {
	city: string;
	latitude: number;
	longitude: number;
}

export interface IPicture {
	id: string;
	url: string;
	isMain: boolean;
}

enum SexualPreference {
	Hetero,
	Bi,
}

export enum Gender {
	Male,
	Female,
}
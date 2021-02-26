export interface IProfile {
	firstName: string;
	lastName: string;
	emailAddress: string;
	birthday: string;
	/* birthday: Date; */
	sexualPreference: string;
	gender: string;
	/* gender: Gender; */
	/* sexualPreference: SexualPreference; */
	fameRating: number;
	biography: string;
	location: ILocation;
	interests: string[];
/* 	pictures: string[]; */
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

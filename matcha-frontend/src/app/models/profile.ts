export interface IProfile {
	firstName: string;
	lastName: string;
/* 	emailAddress: string; */
/* 	birthday: string; */
	/* birthday: Date; */
	sexualPreference: SexualPreference;
	gender: Gender;
	/* gender: Gender; */
	/* sexualPreference: SexualPreference; */
/* 	fameRating: number;
 */	biography: string;
/* 	location: ILocation; */
	interests: string[];
	images: IImage[];
}

export interface IProfileFormValues {
	firstName: String;
	lastName: String;
	gender: String;
	biography: String,
	sexualPreference: String;
	interests: String[];
}

export interface ILocation {
	city: string;
	latitude: number;
	longitude: number;
}

export interface IImage {
	id: string;
	url: string;
	isMain: boolean;
}

export enum SexualPreference {
	Male,
	Female,
	Both,
}

export enum Gender {
	Male,
	Female,
}

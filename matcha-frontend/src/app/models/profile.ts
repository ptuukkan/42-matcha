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
	 */ biography: string;
	/* 	location: ILocation; */
	interests: string[];
	images: IImage[];
}

export interface IProfileFormValues {
	firstName: string;
	lastName: string;
	gender: string;
	biography: string;
	sexualPreference: string;
	interests: string[];
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

export const stringToGender = (data: string): Gender => {
	if (data === 'Male') return Gender.Male;
	return Gender.Female;
};

export const stringToSexPref = (data: string): SexualPreference => {
	if (data === 'Male') return SexualPreference.Male;
	if (data === 'Female') return SexualPreference.Female;
	return SexualPreference.Both;
};

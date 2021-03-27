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
	fameRating: number;
}

export interface IPrivateProfile extends IProfile {
	overwriteLocation: boolean;
	likes: IProfileThumbnail[];
	location: ILocation;
	visits: IProfileThumbnail[];
}

export interface IPublicProfile extends IProfile {
	id: string;
	connected: boolean;
	liked: boolean;
}

export interface IProfileThumbnail {
	id: string;
	firstName: string;
	image: IImage;
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
	latitude: number;
	longitude: number;
}

export interface IImage {
	id: string;
	url: string;
	isMain: boolean;
}

export enum SexualPreference {
	Male = 'Male',
	Female = 'Female',
	Both = 'Both',
}

export enum Gender {
	Male = 'Male',
	Female = 'Female',
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

export interface ILikeResponse {
	connected: boolean;
}

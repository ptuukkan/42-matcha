import agent from '../../api/agent';
import { ILocation } from '../../models/profile';

export const getPosition = (
	options?: PositionOptions
): Promise<GeolocationPosition> => {
	if ('geolocation' in navigator) {
		return new Promise((resolve, reject) =>
			navigator.geolocation.watchPosition(resolve, reject, options)
		);
	} else {
		let error = new Error('Geolocation not supported');
		return Promise.reject(error);
	}
};

export const getLocation = async (): Promise<ILocation> => {
	let location: ILocation = { latitude: 0, longitude: 0 };
	try {
		const geoLocation = await getPosition({ timeout: 2000 });
		location.latitude = geoLocation.coords.latitude;
		location.longitude = geoLocation.coords.longitude;
	} catch (error) {
		try {
			const ipLocation = await agent.Location.get();
			location.latitude = ipLocation.latitude;
			location.longitude = ipLocation.longitude;
		} catch (error) {
			location.latitude = 0.0;
			location.longitude = 0.0;
		}
	}
	return location;
};

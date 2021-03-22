const getPosition = (
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

export { getPosition };

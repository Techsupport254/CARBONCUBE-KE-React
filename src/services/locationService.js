// services/locationService.js
class LocationService {
	constructor() {
		this.isSupported = "geolocation" in navigator;
	}

	// Method 4: Browser Geolocation API
	async getCurrentLocation() {
		return new Promise((resolve, reject) => {
			if (!this.isSupported) {
				reject(new Error("Geolocation is not supported by this browser"));
				return;
			}

			const options = {
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 300000, // 5 minutes
			};

			navigator.geolocation.getCurrentPosition(
				(position) => {
					const location = {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
						accuracy: position.coords.accuracy,
						altitude: position.coords.altitude,
						altitudeAccuracy: position.coords.altitudeAccuracy,
						heading: position.coords.heading,
						speed: position.coords.speed,
						timestamp: position.timestamp,
					};

					resolve(location);
				},
				(error) => {
					reject(error);
				},
				options
			);
		});
	}

	// Method 5: Reverse geocoding using browser location
	async getAddressFromCoordinates(latitude, longitude) {
		try {

			// Use a free reverse geocoding service
			const response = await fetch(
				`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
			);

			if (response.ok) {
				const data = await response.json();
				const address = {
					country: data.countryName,
					countryCode: data.countryCode,
					city: data.city,
					locality: data.locality,
					postcode: data.postcode,
					principalSubdivision: data.principalSubdivision,
					principalSubdivisionCode: data.principalSubdivisionCode,
					formatted_address: `${data.city}, ${data.principalSubdivision}, ${data.countryName}`,
				};

				return address;
			} else {
				throw new Error("Reverse geocoding failed");
			}
		} catch (error) {
			return null;
		}
	}

	// Method 6: Get location from IP (frontend)
	async getLocationFromIP() {
		try {

			const response = await fetch("http://ip-api.com/json/");
			if (response.ok) {
				const data = await response.json();
				const location = {
					country: data.country,
					countryCode: data.countryCode,
					region: data.region,
					regionName: data.regionName,
					city: data.city,
					zip: data.zip,
					latitude: data.lat,
					longitude: data.lon,
					timezone: data.timezone,
					isp: data.isp,
					ip: data.query,
				};

				return location;
			} else {
				throw new Error("IP geolocation failed");
			}
		} catch (error) {
			return null;
		}
	}

	// Method 7: Comprehensive location gathering
	async getAllLocationData() {

		const locationData = {
			sources: [],
			data: {},
		};

		try {
			// Try browser geolocation first
			const browserLocation = await this.getCurrentLocation();
			locationData.data.browser_location = browserLocation;
			locationData.sources.push("browser_geolocation");

			// Try to get address from coordinates
			if (browserLocation) {
				const address = await this.getAddressFromCoordinates(
					browserLocation.latitude,
					browserLocation.longitude
				);
				if (address) {
					locationData.data.address_from_coordinates = address;
					locationData.sources.push("reverse_geocoding");
				}
			}
		} catch (error) {
		}

		try {
			// Try IP-based location as fallback
			const ipLocation = await this.getLocationFromIP();
			if (ipLocation) {
				locationData.data.ip_location = ipLocation;
				locationData.sources.push("ip_geolocation");
			}
		} catch (error) {
		}

		return locationData;
	}
}

export default new LocationService();

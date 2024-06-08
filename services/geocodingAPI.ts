import axios from 'axios';

const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';
const BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

/**
 * Constructs the URL for the Google Maps Geocoding API request.
 * 
 * @param {number} latitute - The latitude coordinate.
 * @param {number} longitude - The longitude coordinate.
 * @returns {string} - The constructed URL.
 */
export function constructGeocodingURL(latitude: number, longitude: number): string {
    return `${BASE_URL}?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
}

/**
 * Fetches geocoding data from the Google Maps Geocoding API.
 *
 * @param {string} url - The URL to fetch the data from.
 * @returns {Promise<any[]>} - The results array from the API response.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function fetchGeocodingData(url: string): Promise<any[]> {
    try {
        const response = await axios.get(url);
        return response.data.results;
    } catch (error) {
        console.error('Error fetching geocoding data:', error);
        throw new Error('Could not retrieve geocoding data.');
    }
}

/**
 * Extracts the zip code from the Google Maps Geocoding API response.
 * 
 * @param {any[]} results - The results array from the API response.
 * @returns {string} - The esctracted zip code.
 * @throws {Error} - Throws an error if no zip code is found.
 */
export function extractZipCode(results: any[]): string {
    // results.map((result: any) => {
    //     result.address_components.map((component: any) => {
    //         if (component.types.includes('postal_code')) {
    //             return Number(component.long_name);
    //         }
    //     })
    // })

    for (const result of results) {
        for (const component of result.address_components) {
            if (component.types.includes('postal_code')) {
                return String(component.long_name);
            }
        }
    }
    throw new Error('Zip code not found for the given coordinates.');
}
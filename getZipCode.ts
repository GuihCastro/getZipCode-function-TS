import { constructGeocodingURL, fetchGeocodingData, extractZipCode } from './services/geocodingAPI';

/**
 * Returns the zip code based on the coordinates (latitude and longitude) received.
 *
 * @param {number} latitude - The latitude coordinate.
 * @param {number} longitude - The longitude coordinate.
 * @returns {Promise<string | null>} - The zip code tracked from the coordinates.
 */
async function getZipCode(latitude: number, longitude: number): Promise<string | null> {
    const url = constructGeocodingURL(latitude, longitude);

    try {
        const results = await fetchGeocodingData(url);
        return extractZipCode(results);
    } catch (error) {
        console.error('Error fetching zip code:', error);
        throw new Error('Could not retrieve zip code.');
    }
}

// Example of usage
// (async () => {
//     try {
//         const zipCode = await getZipCode(-23.5489, -46.6388); // Coordinates for São Paulo, SP, Brazil
//         console.log('Zip Code:', zipCode); // log message: 'Zip Code: 01007040'
//     } catch (error) {
//         console.error(error.message);
//     }
// })();

export default getZipCode;
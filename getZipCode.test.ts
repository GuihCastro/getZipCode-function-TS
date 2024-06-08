import axios from 'axios';
import getZipCode from './getZipCode';
import { constructGeocodingURL, fetchGeocodingData, extractZipCode } from './services/geocodingAPI';

// Mock axios.get for testing getZipCode function
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getZipCode Utilities', () => {

    describe('constructGeocodingURL', () => {
        it('should construct the correct URL with given latitude and longitude', () => {
            const latitude = -23.5489;
            const longitude = -46.6388;
            const expectedURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`;

            const url = constructGeocodingURL(latitude, longitude);

            expect(url).toBe(expectedURL);
        });

        it('should handle positive latitude and longitude correctly', () => {
            const latitude = 37.7749;
            const longitude = -122.4194;
            const expectedURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`;

            const url = constructGeocodingURL(latitude, longitude);

            expect(url).toBe(expectedURL);
        });

        it('should handle zero latitude and longitude correctly', () => {
            const latitude = 0;
            const longitude = 0;
            const expectedURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`;

            const url = constructGeocodingURL(latitude, longitude);

            expect(url).toBe(expectedURL);
        });
    });

    describe('fetchGeocodingData', () => {
        it('should fetch geocoding data from the API', async () => {
            const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=-23.5489,-46.6388&key=YOUR_GOOGLE_MAPS_API_KEY';
            const mockResponse = {
                data: {
                    results: [
                        {
                            address_components: [
                                {
                                    long_name: '01007040',
                                    types: ['postal_code']
                                }
                            ]
                        }
                    ]
                }
            };

            mockedAxios.get.mockResolvedValueOnce(mockResponse);

            const results = await fetchGeocodingData(url);

            expect(results).toEqual(mockResponse.data.results);
        });

        it('should throw an error if the request fails', async () => {
            const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=-23.5489,-46.6388&key=YOUR_GOOGLE_MAPS_API_KEY';

            mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

            await expect(fetchGeocodingData(url)).rejects.toThrow('Could not retrieve geocoding data.');
        });
    });

    describe('extractZipCode', () => {
        it('should extract the zip code from the API results', () => {
            const results = [
                {
                    address_components: [
                        {
                            long_name: '01007040',
                            types: ['postal_code']
                        }
                    ]
                }
            ];

            const zipCode = extractZipCode(results);

            expect(zipCode).toBe('94103');
        });

        it('should throw an error if no zip code is found', () => {
            const results = [
                {
                    address_components: [
                        {
                            long_name: 'São Paulo',
                            types: ['locality']
                        }
                    ]
                }
            ];

            expect(() => extractZipCode(results)).toThrow('Zip code not found for the given coordinates.');
        });

        it('should handle multiple address components correctly', () => {
            const results = [
                {
                    address_components: [
                        {
                            long_name: 'São Paulo',
                            types: ['locality']
                        },
                        {
                            long_name: '01007040',
                            types: ['postal_code']
                        }
                    ]
                }
            ];

            const zipCode = extractZipCode(results);

            expect(zipCode).toBe('94103');
        });
    });

    describe('getZipCode', () => {
        it('should return the zip code for valid coordinates', async () => {
            const latitude = -23.5489;
            const longitude = -46.6388;
            const mockResponse = {
                data: {
                    results: [
                        {
                            address_components: [
                                {
                                    long_name: '01007040',
                                    types: ['postal_code']
                                }
                            ]
                        }
                    ]
                }
            };

            mockedAxios.get.mockResolvedValueOnce(mockResponse);

            const zipCode = await getZipCode(latitude, longitude);

            expect(zipCode).toBe('94103');
        });

        it('should throw an error if the API call fails', async () => {
            const latitude = -23.5489;
            const longitude = -46.6388;

            mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

            await expect(getZipCode(latitude, longitude)).rejects.toThrow('Could not retrieve zip code.');
        });

        it('should throw an error if no zip code is found in the response', async () => {
            const latitude = -23.5489;
            const longitude = -46.6388;
            const mockResponse = {
                data: {
                    results: [
                        {
                            address_components: [
                                {
                                    long_name: 'São Paulo',
                                    types: ['locality']
                                }
                            ]
                        }
                    ]
                }
            };

            mockedAxios.get.mockResolvedValueOnce(mockResponse);

            await expect(getZipCode(latitude, longitude)).rejects.toThrow('Zip code not found for the given coordinates.');
        });
    });
});
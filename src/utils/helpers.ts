import request from 'supertest';

/**
 * Creates a new journey test data object with default values.
 * @returns {Object} The journey test data.
 */
export const createJourneyTestData = () => ({
      pickup: {
        latitude: 1.3521,
        longitude: 103.8198
      },
      dropoff: {
        latitude: 1.2801,
        longitude: 103.8500
      },
      passenger: {
        name: "John",
        surname: "Doe",
        phone_number: "+6598765432"
      },
      departure_date: new Date().toISOString()
    });

/**
 * Processes the API response and handles errors.
 * @param response The API response object.
 * @returns The response body if valid.
 * @throws Error if the response is invalid.
 */
export const processResponse = (response: request.Response) => {
    if (!response || !response.body) {
        console.log("Error: Invalid response: " + JSON.stringify(response));
        throw new Error("Invalid response");
    }
    return response.body;
};

/**
 * Makes an API request to the specified endpoint.
 * @param baseUrl The base URL of the API.
 * @param method The HTTP method to use.
 * @param endpoint The API endpoint.
 * @param data The request payload (for POST, PATCH, PUT).
 * @returns The API response.
 */
export const makeApiRequest = async (
    baseUrl: string,
    method: 'get' | 'post' | 'patch' | 'put' | 'delete',
    endpoint: string,
    data?: any
) => {
    let req = request(baseUrl)[method](endpoint);
    if (data && (method === 'post' || method === 'patch' || method === 'put')) {
        req = req.send(data);
    }
    const response = await req;
    return response;
};
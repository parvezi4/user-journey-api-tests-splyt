import request from 'supertest';

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

export const processResponse = (response: request.Response) => {
    if (!response || !response.body) {
        console.log("Error: Invalid response: " + JSON.stringify(response));
        throw new Error("Invalid response");
    }
    return response.body;
};

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
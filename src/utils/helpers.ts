import request from 'supertest';

export const createJourneyTestData = () => ({
    name: "Test Journey",
    pickup: { lat: 12.34, lng: 56.78 },
    dropoff: { lat: 87.65, lng: 43.21 },
    passengers: [
        { id: 'passenger1', firstName: 'John', lastName: 'Doe', phoneNumber: '123-456-7890' }
    ],
    departureDate: new Date().toISOString()
});

export const processResponse = (response: request.Response) => {
    if (!response || !response.body) {
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
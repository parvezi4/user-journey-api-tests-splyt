
import request from 'supertest';
import { createJourneyTestData, processResponse, makeApiRequest } from '../utils/helpers';

const baseUrl = 'https://qa-interview-test.qa.splytech.dev';

describe('User Journey API', () => {
  let journey_id: string;
  let response_body: {
    _id: string, 
    pickup: { latitude: number, longitude: number }, 
    dropoff: { latitude: number, longitude: number }, 
    passenger: { name: string, surname: string, phone_number: string }, 
    departure_date: string
  };

  it('POST /api/journeys - create a new user journey', async () => {
    const newJourney = createJourneyTestData();
    const response = await makeApiRequest(baseUrl, 'post', '/api/journeys', newJourney);

    expect(() => processResponse(response)).not.toThrow();
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');
    
    journey_id = response.body._id;// save journey
    response_body = response.body;// save body
    //console.log('Created journey with ID:', journey_id);// in case we need to check the value and use later on Postman
  });

  it('PATCH /api/journeys - update a user journey for pickup and dropoff locations', async () => {
    const updateData = {
      journey_id: journey_id,
      pickup: { latitude: 12.34, longitude: 56.78 },
      dropoff: { latitude: 87.65, longitude: 43.21 },
      departure_date: new Date().toISOString()
    };//only updates the pickup and dropoff locations
    const response = await makeApiRequest(baseUrl, 'patch', '/api/journeys', updateData);

    expect(() => processResponse(response)).not.toThrow();
    expect(response.status).toBe(200);
    expect(response.body._id).toEqual(updateData.journey_id);
    expect(response.body.pickup).toEqual(updateData.pickup);
    expect(response.body.dropoff).toEqual(updateData.dropoff);
    expect(response.body.departure_date).toEqual(updateData.departure_date);
    expect(response.body.passenger).toEqual(response_body.passenger);// checking passenger details from previously created journey
  });

  it('GET /api/journeys/:journey_id - get a journey', async () => {
    // match against a known data set that was pre-created (not always a safe technique!)
    const expectedJourney = {
      _id: "68adb597f16d278b7f75d188",
      pickup: {
        latitude: 1.3521,
        longitude: 103.8198
      },
      dropoff: {
        latitude: 1.2801,
        longitude: 103.85
      },
      departure_date: "2025-08-15T14:30:00.000Z",
      passenger: {
        name: "John",
        surname: "Doe",
        phone_number: "+6598765432"
      }
    };
    const response = await makeApiRequest(baseUrl, 'get', `/api/journeys/${expectedJourney._id}`);

    expect(() => processResponse(response)).not.toThrow();
    expect(response.status).toBe(200);
    expect(response.body.pickup).toEqual(expectedJourney.pickup);
    expect(response.body.dropoff).toEqual(expectedJourney.dropoff);
    expect(response.body.passenger).toEqual(expectedJourney.passenger);
    expect(response.body.departure_date).toBe(expectedJourney.departure_date);
  });
});
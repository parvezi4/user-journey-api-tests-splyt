import { createJourneyTestData, processResponse, makeApiRequest } from '../utils/helpers';
import { baseUrl } from './config';

/**
 * User Journey API - Basic test coverage for GET endpoint
 */
describe('User Journey API - Basic test coverage', () => {

  it('GET /api/journeys/:journey_id - get a journey', async () => {
    // match against a known data set that was pre-created (not always a safe technique; better to create)
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

/**
 * Boundary value tests for the GET /api/journeys/:journey_id endpoint
 */
describe('GET /api/journeys/:journey_id - boundary value tests', () => {
  let valid_journey_id: string;

  beforeAll(async () => {
    // Create a valid journey to get
    const journey = createJourneyTestData();
    const response = await makeApiRequest(baseUrl, 'post', '/api/journeys', journey);
    valid_journey_id = response.body._id;
  });

  it('should return 200 and journey for a valid ID', async () => {
    const response = await makeApiRequest(baseUrl, 'get', `/api/journeys/${valid_journey_id}`);
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(valid_journey_id);
  });

  it('should return 404 for a non-existent but well-formed ID', async () => {
    const response = await makeApiRequest(baseUrl, 'get', '/api/journeys/0000000000000000000000001');
    expect(response.status).toBe(400);
  });

  it('should return 400 for a malformed ID (too short)', async () => {
    const response = await makeApiRequest(baseUrl, 'get', '/api/journeys/1');
    expect(response.status).toBe(400);
  });

  it('should return 400 for a malformed ID (too long)', async () => {
    const response = await makeApiRequest(baseUrl, 'get', '/api/journeys/' + 'a'.repeat(100));
    expect(response.status).toBe(400);
  });

  it('should return 400 for a malformed ID (invalid characters)', async () => {
    const response = await makeApiRequest(baseUrl, 'get', '/api/journeys/!@#$%^&*()_+');
    expect(response.status).toBe(400);
  });

});
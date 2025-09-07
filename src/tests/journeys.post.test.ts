
import { createJourneyTestData, processResponse, makeApiRequest } from '../utils/helpers';
import { baseUrl } from './config';

/**
 * User Journey API - Basic test coverage (happy path, P0 flows)
 */
describe('User Journey API - Basic test coverage', () => {

  it('POST /api/journeys - create a new user journey', async () => {
    const newJourney = createJourneyTestData();
    const response = await makeApiRequest(baseUrl, 'post', '/api/journeys', newJourney);

    expect(() => processResponse(response)).not.toThrow();
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.pickup).toEqual(newJourney.pickup);
    expect(response.body.dropoff).toEqual(newJourney.dropoff);
    expect(response.body.passenger).toEqual(newJourney.passenger);
    expect(response.body.departure_date).toEqual(newJourney.departure_date);
    //console.log('Created journey with ID:', journey_id);// in case we need to check the value and use later on Postman
  });
});

/**
 * Boundary value tests for the POST /api/journeys endpoint
 */
describe('POST /api/journeys - boundary value tests', () => {
  it('should return an empty passenger object as status 400', async () => {
    const journey = createJourneyTestData();
    // (journey as any).passenger = undefined;
    // journey.passenger = {};
    delete (journey as any).passenger;
    const response = await makeApiRequest(baseUrl, 'post', '/api/journeys', journey);
    expect(response.status).toBe(400);
  });

  // Pickup Latitude: valid range -90 to 90
  it.each([
    [-90.1, 400],
    [-90, 200],
    [90, 200],
    [90.1, 400]
  ])('should validate pickup latitude %p to return status %p', async (latitude, expectedStatus) => {
    const journey = createJourneyTestData();
    journey.pickup.latitude = latitude;
    const response = await makeApiRequest(baseUrl, 'post', '/api/journeys', journey);
    expect(response.status).toBe(expectedStatus);
  });
  
  // Pickup Longitude: valid range -180 to 180
  it.each([
    [-180.1, 400],
    [-180, 200],
    [180, 200],
    [180.1, 400]
  ])('should validate pickup longitude %p to return status %p', async (longitude, expectedStatus) => {
    const journey = createJourneyTestData();
    journey.pickup.longitude = longitude;
    const response = await makeApiRequest(baseUrl, 'post', '/api/journeys', journey);
    expect(response.status).toBe(expectedStatus);
  });

  // TODO: Repeat combinations of dropoff coordinates
  // Dropoff Latitude: valid range -90 to 90
  it.each([
    [-90.1, 400],
    [-90, 200],
    [90, 200],
    [90.1, 400],
    [0, 200]
  ])('should validate dropoff latitude %p to return status %p', async (latitude, expectedStatus) => {
    const journey = createJourneyTestData();
    journey.dropoff.latitude = latitude;
    const response = await makeApiRequest(baseUrl, 'post', '/api/journeys', journey);
    expect(response.status).toBe(expectedStatus);
  });

  // Dropoff Longitude: valid range -180 to 180
  it.each([
    [-180.1, 400],
    [-180, 200],
    [180, 200],
    [180.1, 400],
    [0, 200]
  ])('should validate dropoff longitude %p to return status %p', async (longitude, expectedStatus) => {
    const journey = createJourneyTestData();
    journey.dropoff.longitude = longitude;
    const response = await makeApiRequest(baseUrl, 'post', '/api/journeys', journey);
    expect(response.status).toBe(expectedStatus);
  });

  // Passenger name: min 1 char, max 50 chars (assuming)
  it('should reject passenger name as empty string', async () => {
    const journey = createJourneyTestData();
    journey.passenger.name = '';
    const response = await makeApiRequest(baseUrl, 'post', '/api/journeys', journey);
    expect(response.status).toBe(400);
  });

  it('should reject passenger surname as empty string', async () => {
    const journey = createJourneyTestData();
    journey.passenger.surname = '';
    const response = await makeApiRequest(baseUrl, 'post', '/api/journeys', journey);
    expect(response.status).toBe(400);
  });

  it('should accept passenger name and surname at minimum length', async () => {
    const journey = createJourneyTestData();
    journey.passenger.name = 'A';
    journey.passenger.surname = 'X';
    const response = await makeApiRequest(baseUrl, 'post', '/api/journeys', journey);
    expect(response.status).toBe(200);
  });

  it('should accept passenger name and surname at maximum length', async () => {
    const journey = createJourneyTestData();
    journey.passenger.name = 'A'.repeat(50);
    journey.passenger.surname = 'X'.repeat(50);
    const response = await makeApiRequest(baseUrl, 'post', '/api/journeys', journey);
    expect(response.status).toBe(200);
  });

  // We don't know the max length for name and surname
  it('should reject passenger name and surname above maximum length', async () => {
    const journey = createJourneyTestData();
    journey.passenger.name = 'A'.repeat(200);
    journey.passenger.surname = 'X'.repeat(200);
    const response = await makeApiRequest(baseUrl, 'post', '/api/journeys', journey);
    expect(response.status).toBe(400);
  });

  // Potential bug where special characters are accepted for names
  it('should reject passenger name with certain special characters (i.e., $, #, @, ^, *)', async () => {
    const journey = createJourneyTestData();
    journey.passenger.name = 'David O\'brian$ # @ ^ *';
    const response = await makeApiRequest(baseUrl, 'post', '/api/journeys', journey);
    expect(response.status).toBe(400);
  });

  // Departure date: test invalid and valid ISO strings
  it('should reject invalid departure_date', async () => {
    const journey = createJourneyTestData();
    journey.departure_date = '2025-08-27';
    const response = await makeApiRequest(baseUrl, 'post', '/api/journeys', journey);
    expect(response.status).toBe(400);
  });

  it('should accept valid ISO departure_date', async () => {
    const journey = createJourneyTestData();
    // journey.departure_date = new Date().toISOString();
    journey.departure_date = '2025-09-07T08:31:11.214Z';
    const response = await makeApiRequest(baseUrl, 'post', '/api/journeys', journey);
    expect(response.status).toBe(200);
  });
});

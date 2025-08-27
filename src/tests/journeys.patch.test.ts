
import { createJourneyTestData, processResponse, makeApiRequest } from '../utils/helpers';
import { baseUrl } from './config';

/**
 * User Journey API - Basic test coverage (happy path, P0 flows)
 */
describe('User Journey API - Basic test coverage', () => {

  it('PATCH /api/journeys - update a user journey for pickup and dropoff locations', async () => {
    const newJourney = createJourneyTestData();
    const postResponse = await makeApiRequest(baseUrl, 'post', '/api/journeys', newJourney);
    const journey_id = postResponse.body._id;
    const updateData = {
      journey_id: journey_id,
      pickup: { latitude: 12.34, longitude: 56.78 },
      dropoff: { latitude: 87.65, longitude: 43.21 },
      departure_date: new Date().toISOString()
    };//only updates the pickup and dropoff locations
    const patchResponse = await makeApiRequest(baseUrl, 'patch', '/api/journeys', updateData);

    expect(() => processResponse(patchResponse)).not.toThrow();
    expect(patchResponse.status).toBe(200);
    expect(patchResponse.body._id).toEqual(updateData.journey_id);
    expect(patchResponse.body.pickup).toEqual(updateData.pickup);
    expect(patchResponse.body.dropoff).toEqual(updateData.dropoff);
    expect(patchResponse.body.departure_date).toEqual(updateData.departure_date);
    expect(patchResponse.body.passenger).toEqual(postResponse.body.passenger);// checking passenger details from previously created journey
  });

});

/**
 * Boundary value tests for the PATCH /api/journeys endpoint
 * 
 * For this endpoint, only _id is required, rest are optional
 */
describe('PATCH /api/journeys - boundary value tests', () => {
  let journey_id: string;

  beforeAll(async () => {
    // Create a valid journey using POST method first...
    const journey = createJourneyTestData();
    const response = await makeApiRequest(baseUrl, 'post', '/api/journeys', journey);
    journey_id = response.body._id;
  });

  /**
   * Validate pickup coordinates with boundary values for longitude and latitude
   */
  it.each([
    [-90.1, 10, 400],
    [-90, 10, 200],
    [90, 10, 200],
    [90.1, 10, 400],
    [10, 180, 200],
    [10, 180.1, 400],
    [10, -180, 200],
    [10, -180.1, 400]
  ])('should validate pickup latitude %p and longitude %p to return status %p',
    async (latitude, longitude, expectedStatus) => {
    const updateData = {
      journey_id,
      pickup: { latitude, longitude }
    };
    const response = await makeApiRequest(baseUrl, 'patch', '/api/journeys', updateData);
    expect(response.status).toBe(expectedStatus);
  });

  // TODO: Repeat for other combinations of dropoff coordinates

  it('should accept empty passenger name', async () => {
    const updateData = {
      journey_id,
      passenger: { name: '', surname: 'Doe' }
    };
    const response = await makeApiRequest(baseUrl, 'patch', '/api/journeys', updateData);
    expect(response.status).toBe(200);
  });

  it('should accept empty passenger surname', async () => {
    const updateData = {
      journey_id,
      passenger: { name: 'John', surname: '' }
    };
    const response = await makeApiRequest(baseUrl, 'patch', '/api/journeys', updateData);
    expect(response.status).toBe(200);
  });

  it('should accept passenger name and surname at minimum length', async () => {
    const updateData = {
      journey_id,
      passenger: { name: 'A', surname: 'B' }
    };
    const response = await makeApiRequest(baseUrl, 'patch', '/api/journeys', updateData);
    expect(response.status).toBe(200);
  });

  // TODO: repeat for other combinations of passenger name and surname

  it('should reject invalid departure_date string', async () => {
    const updateData = {
      journey_id,
      departure_date: 'invalid-date'
    };
    const response = await makeApiRequest(baseUrl, 'patch', '/api/journeys', updateData);
    expect(response.status).toBe(400);
  });

  it('should reject departure_date string with non-conformant ISO value', async () => {
    const updateData = {
      journey_id,
      departure_date: '2025-08-27'
    };
    const response = await makeApiRequest(baseUrl, 'patch', '/api/journeys', updateData);
    expect(response.status).toBe(400);
  });

  it('should accept valid ISO departure_date', async () => {
    const updateData = {
      journey_id,
      departure_date: new Date().toISOString()
    };
    const response = await makeApiRequest(baseUrl, 'patch', '/api/journeys', updateData);
    expect(response.status).toBe(200);
  });

});

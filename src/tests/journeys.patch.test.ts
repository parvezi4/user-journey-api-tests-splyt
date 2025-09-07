
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
    [10, -180.1, 400],
    [0, 0, 200]  // valid center point
  ])('should validate pickup latitude %p and longitude %p to return status %p',
    async (latitude, longitude, expectedStatus) => {
    const updateData = {
      journey_id,
      pickup: { latitude, longitude }
    };
    const response = await makeApiRequest(baseUrl, 'patch', '/api/journeys', updateData);
    expect(response.status).toBe(expectedStatus);
  });

  /**
   * Validate dropoff coordinates with boundary values for longitude and latitude
   */
  it.each([
    [-90.1, 10, 400],
    [-90, 10, 200],
    [90, 10, 200],
    [90.1, 10, 400],
    [10, 180, 200],
    [10, 180.1, 400],
    [10, -180, 200],
    [10, -180.1, 400],
    [0, 0, 200]  // valid center point
  ])('should validate dropoff latitude %p and longitude %p to return status %p',
    async (latitude, longitude, expectedStatus) => {
    const updateData = {
      journey_id,
      dropoff: { latitude, longitude }
    };
    const response = await makeApiRequest(baseUrl, 'patch', '/api/journeys', updateData);
    expect(response.status).toBe(expectedStatus);
  });

  it.each([
    ['', 'Doe'],
    ['John', ''],
  ])('should not accept passenger name %p and surname %p', async (name, surname) => {
    const updateData = {
      journey_id,
      passenger: { name, surname }
    };
    const response = await makeApiRequest(baseUrl, 'patch', '/api/journeys', updateData);
    expect(response.status).toBe(400);
  });

  it('should accept passenger name and surname at minimum length (assuming 1 char)', async () => {
    const updateData = {
      journey_id,
      passenger: { name: 'A', surname: 'B' }
    };
    const response = await makeApiRequest(baseUrl, 'patch', '/api/journeys', updateData);
    expect(response.status).toBe(200);
  });

  it('should accept passenger name and surname at maximum length (assuming 50 chars)', async () => {
    const longName = 'A'.repeat(50);
    const longSurname = 'B'.repeat(50);
    const updateData = {
      journey_id,
      passenger: { name: longName, surname: longSurname }
    };
    const response = await makeApiRequest(baseUrl, 'patch', '/api/journeys', updateData);
    expect(response.status).toBe(200);
  });

  it('should reject passenger name and surname above maximum length (assuming 50 chars)', async () => {
    const tooLongName = 'A'.repeat(51);
    const tooLongSurname = 'B'.repeat(51);
    const updateData = {
      journey_id,
      passenger: { name: tooLongName, surname: tooLongSurname }
    };
    const response = await makeApiRequest(baseUrl, 'patch', '/api/journeys', updateData);
    expect(response.status).toBe(400);
  });

  it.each([
    null,
    undefined,
    {}  
  ])('should reject invalid passenger object %p', async (passenger) => {
    const updateDataNull = {
      journey_id,
      passenger
    };
    const responseNull = await makeApiRequest(baseUrl, 'patch', '/api/journeys', updateDataNull);
    expect(responseNull.status).toBe(400);
  });

  it.each([
    ['invalid-phone'],
    ['12345'],
    ['+123'], // too short
    ['+12345678901234567'], // too long
    ['+12-34567890'], // invalid characters
    ['(123)4567890'], // invalid characters
    ['123.456.7890'], // invalid characters
    ['+12 34567890'], // spaces not allowed
    ['+12_34567890'], // underscores not allowed
    ['+12@34567890'], // special characters not allowed
    ['+12#34567890'], // special characters not allowed
    ['+12$34567890'], // special characters not allowed
  ])('should reject invalid phone number format %p', async (phoneNumber) => {
    const updateData = {
      journey_id,
      passenger: { name: 'John', surname: 'Doe', phone_number: phoneNumber }
    };
    const response = await makeApiRequest(baseUrl, 'patch', '/api/journeys', updateData);
    expect(response.status).toBe(400);
  });

  it.each([
    ['+1234567890'], // valid US format
    ['+6598765432'], // valid Singapore format
    ['+441234567890'], // valid UK format
  ])('should accept valid phone number format %p', async (phoneNumber) => {
    const updateData = {
      journey_id,
      passenger: { name: 'John', surname: 'Doe', phone_number: phoneNumber }
    };
    const response = await makeApiRequest(baseUrl, 'patch', '/api/journeys', updateData);
    expect(response.status).toBe(200);
  });

  it.each([
    'invalid-date',
    '2025-08-27',
    null,
    undefined, '',
    '2025-13-01T00:00:00Z', // invalid month
    '2025-00-01T00:00:00Z', // invalid month
    '2025-01-32T00:00:00Z', // invalid day
    '2025-01-00T00:00:00Z', // invalid day
    '2025-01-01T24:01:00Z', // invalid hour
    '2025-01-01T00:60:00Z', // invalid minute
    '2025-01-01T00:00:60Z'  // invalid second
  ])('should reject invalid departure_date string %p', async (invalidDate ) => {
    const updateData = {
      journey_id,
      departure_date: invalidDate
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

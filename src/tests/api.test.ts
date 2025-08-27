
import request from 'supertest';
import { createJourneyTestData, processResponse, makeApiRequest } from '../utils/helpers';

const baseUrl = 'https://qa-interview-test.qa.splytech.dev';

/**
 * User Journey API - Basic test coverage (happy path, P0 flows)
 */
describe('User Journey API - Basic test coverage', () => {
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

/**
 * Boundary value tests for the POST /api/journeys endpoint
 */
describe('POST /api/journeys - boundary value tests', () => {
  // Latitude: valid range -90 to 90
  it('should reject pickup latitude below minimum', async () => {
    const journey = createJourneyTestData();
    journey.pickup.latitude = -90.1;
    const response = await makeApiRequest(baseUrl, 'post', '/api/journeys', journey);
    expect(response.status).toBe(400);
  });

  it('should accept pickup latitude at minimum', async () => {
    const journey = createJourneyTestData();
    journey.pickup.latitude = -90;
    const response = await makeApiRequest(baseUrl, 'post', '/api/journeys', journey);
    expect(response.status).toBe(200);
  });

  it('should accept pickup latitude at maximum', async () => {
    const journey = createJourneyTestData();
    journey.pickup.latitude = 90;
    const response = await makeApiRequest(baseUrl, 'post', '/api/journeys', journey);
    expect(response.status).toBe(200);
  });

  it('should reject pickup latitude above maximum', async () => {
    const journey = createJourneyTestData();
    journey.pickup.latitude = 90.1;
    const response = await makeApiRequest(baseUrl, 'post', '/api/journeys', journey);
    expect(response.status).toBe(400);
  });

  // Longitude: valid range -180 to 180
  it('should reject pickup longitude below minimum', async () => {
    const journey = createJourneyTestData();
    journey.pickup.longitude = -180.1;
    const response = await makeApiRequest(baseUrl, 'post', '/api/journeys', journey);
    expect(response.status).toBe(400);
  });

  it('should accept pickup longitude at minimum', async () => {
    const journey = createJourneyTestData();
    journey.pickup.longitude = -180;
    const response = await makeApiRequest(baseUrl, 'post', '/api/journeys', journey);
    expect(response.status).toBe(200);
  });

  it('should accept pickup longitude at maximum', async () => {
    const journey = createJourneyTestData();
    journey.pickup.longitude = 180;
    const response = await makeApiRequest(baseUrl, 'post', '/api/journeys', journey);
    expect(response.status).toBe(200);
  });

  it('should reject pickup longitude above maximum', async () => {
    const journey = createJourneyTestData();
    journey.pickup.longitude = 180.1;
    const response = await makeApiRequest(baseUrl, 'post', '/api/journeys', journey);
    expect(response.status).toBe(400);
  });
  // TODO: Repeat for other combinations of dropoff coordinates

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

  it('should reject passenger name and surname above maximum length', async () => {
    const journey = createJourneyTestData();
    journey.passenger.name = 'A'.repeat(200);
    journey.passenger.surname = 'X'.repeat(200);
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
    journey.departure_date = new Date().toISOString();
    const response = await makeApiRequest(baseUrl, 'post', '/api/journeys', journey);
    expect(response.status).toBe(200);
  });
});

/**
 * Boundary value tests for the PATCH /api/journeys endpoint
 */
describe('PATCH /api/journeys - boundary value tests', () => {
  let journey_id: string;

  beforeAll(async () => {
    // Create a valid journey using POST method first...
    const journey = createJourneyTestData();
    const response = await makeApiRequest(baseUrl, 'post', '/api/journeys', journey);
    journey_id = response.body._id;
  });

  it('should reject pickup latitude below minimum', async () => {
    const updateData = {
      journey_id,
      pickup: { latitude: -91, longitude: 103.8198 }
    };
    const response = await makeApiRequest(baseUrl, 'patch', '/api/journeys', updateData);
    expect(response.status).toBe(400);
  });

  it('should accept dropoff latitude at minimum', async () => {
    const updateData = {
      journey_id,
      dropoff: { latitude: -90, longitude: 103.8198 }
    };
    const response = await makeApiRequest(baseUrl, 'patch', '/api/journeys', updateData);
    expect(response.status).toBe(200);
  });

  // TODO: Repeat for other combinations of pickup and dropoff coordinates

  it('should reject empty passenger name', async () => {
    const updateData = {
      journey_id,
      passenger: { name: '', surname: 'Doe' }
    };
    const response = await makeApiRequest(baseUrl, 'patch', '/api/journeys', updateData);
    expect(response.status).toBe(400);
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
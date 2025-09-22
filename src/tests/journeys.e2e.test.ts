import { createJourneyTestData, processResponse, makeApiRequest } from '../utils/helpers';
import { baseUrl } from './config';

/**
 * End-to-end tests for the User Journey API.
 * This suite covers creating a journey, updating it, and verifying the changes.
 */
describe('User Journey API - E2E user journey', () => {
  let journeyId: string;
  let originalJourney: any;

  it('should create a new journey and verify creation', async () => {
    originalJourney = createJourneyTestData();
    const response = await makeApiRequest(baseUrl, 'post', '/api/journeys', originalJourney);
    expect(() => processResponse(response)).not.toThrow();
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');
    journeyId = response.body._id;
    expect(response.body.pickup).toEqual(originalJourney.pickup);
    expect(response.body.dropoff).toEqual(originalJourney.dropoff);
    expect(response.body.passenger).toEqual(originalJourney.passenger);
    expect(response.body.departure_date).toEqual(originalJourney.departure_date);
  });

  /**
   * Test to update the journey and verify that the updates are correctly applied.
   * It checks that the updated fields reflect the new values while unchanged fields remain the same.
   */
  it('should update the journey and verify update', async () => {
    const updatedData = {
      journey_id: journeyId,
      pickup: {
        ...originalJourney.pickup,
        latitude: 1.4000,
      },
      dropoff: originalJourney.dropoff,
      departure_date: originalJourney.departure_date,
    };
    const patchResponse = await makeApiRequest(baseUrl, 'patch', `/api/journeys`, updatedData);
    expect(() => processResponse(patchResponse)).not.toThrow();
    expect(patchResponse.status).toBe(200);
    expect(patchResponse.body.pickup.latitude).toBe(1.4000);
    // Ensure unchanged fields remain the same
    expect(patchResponse.body.pickup.longitude).toEqual(originalJourney.pickup.longitude);
    expect(patchResponse.body.dropoff).toEqual(originalJourney.dropoff);
    expect(patchResponse.body.departure_date).toEqual(originalJourney.departure_date);
    expect(patchResponse.body.passenger).toEqual(originalJourney.passenger);
  });

});

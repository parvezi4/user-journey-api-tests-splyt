
import request from 'supertest';

const baseUrl = 'https://qa-interview-test.qa.splytech.dev';

describe('User Journey API', () => {
  let journey_id: string;
  type pickup = {
    longitude: number;
    latitude: number;
  };
  type dropoff = {
    longitude: number;
    latitude: number;
  };
  type passenger = {
    id: string;
    name: string;
    surename: string;
    phone_number: string;
  };
  let departure_date: Date;// must be in ISO-8601 format

  it.only('POST /api/journeys - create a new user journey', async () => {
    const newJourney = { pickup: { latitude: 12.34, longitude: 56.78 }, dropoff: { latitude: 87.65, longitude: 43.21 }, passenger: { id: 'passenger1', name: 'John', surename: 'Doe', phone_number: '123-456-7890' }, departure_date: new Date().toISOString() };
    const response = await request(baseUrl)
      .post('/api/journeys')
      .send(newJourney);

    expect(response.status).toBe(201);
    // expect(response.body).toHaveProperty('journeyId');
    journey_id = response.body.journey_id;//save journey
  });

  it('PATCH /api/journeys - update a user journey for pickup and dropoff locations', async () => {
    const updateData = { journey_id: journey_id, pickup: { lat: 12.34, lng: 56.78 }, dropoff: { lat: 87.65, lng: 43.21 }, departure_date: new Date().toISOString() };//only updates the pickup and dropoff locations
    const response = await request(baseUrl)
      .patch('/api/journeys')
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('journey_id');
  });

  it('GET /api/journeys/:journey_id - get a journey', async () => {
    const response = await request(baseUrl)
      .get(`/api/journeys/${journey_id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('journey_id');
    expect(response.body).toHaveProperty('pickup');
    expect(response.body).toHaveProperty('dropoff');
    expect(response.body).toHaveProperty('passenger');
    expect(response.body).toHaveProperty('departure_date');
  });
});
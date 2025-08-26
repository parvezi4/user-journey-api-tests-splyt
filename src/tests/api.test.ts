import { test, expect } from '@playwright/test';
import request from 'supertest';

const baseUrl = 'http://your-api-url.com'; // Replace with your API base URL

test.describe('User Journey API', () => {
  let journeyId: string;
  type pickup = {
    lat: number;
    lng: number;
  };
  type dropoff = {
    lat: number;
    lng: number;
  };
  type passenger = {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  let departureDate: Date;// must be in ISO-8601 format

  test('POST /api/journeys - create a new user journey', async () => {
    const newJourney = { journeyId: 'journey1', pickup: { lat: 12.34, lng: 56.78 }, dropoff: { lat: 87.65, lng: 43.21 }, passenger: [{ id: 'passenger1', firstName: 'John', lastName: 'Doe', phoneNumber: '123-456-7890' }], departureDate: new Date().toISOString() }; 
    const response = await request(baseUrl)
      .post('/api/journeys')
      .send(newJourney);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('journeyId');
    journeyId = response.body.journeyId;//save journey
  });

  test('PATCH /api/journeys - update a user journey for pickup and dropoff locations', async () => {
    const updateData = { journeyId: journeyId, pickup: { lat: 12.34, lng: 56.78 }, dropoff: { lat: 87.65, lng: 43.21 }, departureDate: new Date().toISOString() };//only updates the pickup and dropoff locations
    const response = await request(baseUrl)
      .patch('/api/journeys')
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('journeyId');
  });

  test('GET /api/journeys/:journey_id - get a journey', async () => {
    const response = await request(baseUrl)
      .get(`/api/journeys/${journeyId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('journeyId');
    expect(response.body).toHaveProperty('pickup');
    expect(response.body).toHaveProperty('dropoff');
    expect(response.body).toHaveProperty('passenger');
    expect(response.body).toHaveProperty('departureDate');
  });
});
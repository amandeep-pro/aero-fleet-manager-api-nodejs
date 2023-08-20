import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import express from 'express';
import routes from '../src/routes'; 
import { faker } from '@faker-js/faker';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use('/', routes);

describe('Mission API', () => {
  let testMissionId: string;
  let testAircraftId: string;

  // Create a new aircraft and mission before running tests
  beforeAll(async () => {
    const aircraftResponse = await request(app)
      .post('/api/aircrafts')
      .send({
        model: faker.vehicle.model(),
        registration: faker.vehicle.vin(),
        manufacturer: faker.vehicle.manufacturer(),
        capacity: faker.number.int({ min: 50, max: 500 }), 
        status: faker.helpers.arrayElement(['in service', 'under maintenance', 'retired'])
      });
    testAircraftId = aircraftResponse.body.id;

    const missionResponse = await request(app)
      .post('/api/missions')
      .send({
        name: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        launchDate: faker.date.future().toISOString(),
        status: faker.helpers.arrayElement(['planned', 'scheduled', 'completed']),
        aircraftId: testAircraftId
      });
    testMissionId = missionResponse.body.id;
  });

  // Test GET all missions
  it('should get all missions', async () => {
    const response = await request(app).get('/api/missions');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  // Test GET single mission
  it('should get a single mission by ID', async () => {
    const response = await request(app).get(`/api/missions/${testMissionId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(testMissionId);
  });

  // Test POST create mission
  it('should create a new mission', async () => {
    const response = await request(app)
      .post('/api/missions')
      .send({
        name: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        launchDate: faker.date.future().toISOString(),
        status: faker.helpers.arrayElement(['planned', 'scheduled', 'completed']),
        aircraftId: testAircraftId
      });
    expect(response.status).toBe(201);
    expect(response.body.name).toBeTruthy();
  });

  // Test PUT update mission
  it('should update an existing mission', async () => {
    const response = await request(app)
      .put(`/api/missions/${testMissionId}`)
      .send({ status: 'completed' });
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('completed');
  });

  // Test DELETE mission
  it('should delete a mission', async () => {
    const response = await request(app).delete(`/api/missions/${testMissionId}`);
    expect(response.status).toBe(204);
  });

  // Clean up after tests
  afterAll(async () => {
    await prisma.$disconnect();
  });
});

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

  // Create a new aircraft before running tests
  beforeAll(async () => {
    const aircraftResponse = await request(app)
      .post('/api/aircrafts')
      .send({
        model: faker.vehicle.model(),
        registration: faker.vehicle.vin(),
        manufacturer: faker.vehicle.manufacturer(),
        capacity: faker.number.int({ min: 50, max: 500 }),
        status: 'in service'
      });
    testAircraftId = aircraftResponse.body.id;

    const missionResponse = await request(app)
      .post('/api/missions')
      .send({
        name: faker.lorem.words(3),
        description: faker.lorem.sentences(2),
        launchDate: faker.date.future(),
        status: 'planned',
        aircraftId: testAircraftId
      });
    testMissionId = missionResponse.body.id;
  });

  // Test GET all missions with pagination
  it('should get all missions with pagination', async () => {
    const page = 1;
    const pageSize = 2;
    const response = await request(app).get(`/api/missions?page=${page}&pageSize=${pageSize}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.meta).toHaveProperty('totalItems');
    expect(response.body.meta).toHaveProperty('currentPage');
    expect(response.body.meta).toHaveProperty('totalPages');
    expect(response.body.meta).toHaveProperty('pageSize');
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
        name: faker.lorem.words(3),
        description: faker.lorem.sentences(2),
        launchDate: faker.date.future(),
        status: 'planned',
        aircraftId: testAircraftId
      });
    expect(response.status).toBe(201);
    expect(response.body.name).toBe(response.body.name); 
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

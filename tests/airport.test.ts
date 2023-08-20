import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import express from 'express';
import routes from '../src/routes'; 
import { faker } from '@faker-js/faker';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use('/', routes);

describe('Airport API', () => {
  let testAirportId: string;

  // Create a new airport before running tests
  beforeAll(async () => {
    const response = await request(app)
      .post('/api/airports')
      .send({
        name: faker.address.city(), 
        code: faker.datatype.uuid().slice(0, 3).toUpperCase(), 
        location: faker.address.city(),
        country: faker.address.country()
      });
    testAirportId = response.body.id;
  });

  // Test GET all airports
  it('should get all airports', async () => {
    const response = await request(app).get('/api/airports');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  // Test GET single airport
  it('should get a single airport by ID', async () => {
    const response = await request(app).get(`/api/airports/${testAirportId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(testAirportId);
  });

  // Test POST create airport
  it('should create a new airport', async () => {
    const response = await request(app)
      .post('/api/airports')
      .send({
        name: faker.address.city(),
        code: faker.datatype.uuid().slice(0, 3).toUpperCase(), 
        location: faker.address.city(),
        country: faker.address.country()
      });
    expect(response.status).toBe(201);
    expect(response.body.name).toBe(response.body.name); 
  });

  // Test PUT update airport
  it('should update an existing airport', async () => {
    const newLocation = faker.address.city();
    const response = await request(app)
      .put(`/api/airports/${testAirportId}`)
      .send({ location: newLocation });
    expect(response.status).toBe(200);
    expect(response.body.location).toBe(newLocation);
  });

  // Test DELETE airport
  it('should delete an airport', async () => {
    const response = await request(app).delete(`/api/airports/${testAirportId}`);
    expect(response.status).toBe(204);
  });

  // Clean up after tests
  afterAll(async () => {
    await prisma.$disconnect();
  });
});

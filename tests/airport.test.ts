import request from 'supertest';
import express from 'express';
import routes from '../src/routes'; 
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use('/', routes); 

describe('Airport API', () => {
  let testAirportId: string;

  // Create a new airport before running tests
  beforeAll(async () => {
    try {
      const response = await request(app)
        .post('/api/airports')
        .send({
          name: faker.address.city(), 
          code: faker.datatype.uuid().slice(0, 3).toUpperCase(), 
          location: faker.address.city(),
          country: faker.address.country(),
        });
      testAirportId = response.body.id;
      if (!testAirportId) {
        throw new Error('Failed to create test airport');
      }
    } catch (error) {
      console.error('Error in beforeAll:', error);
      throw error;
    }
  });

  // Test GET all airports with pagination
  it('should get all airports with pagination', async () => {
    try {
      const response = await request(app).get('/api/airports?page=1&pageSize=10');
      if (response.status !== 200) {
        console.error('Error in GET all airports:', response.body);
      }
      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.meta).toHaveProperty('totalItems');
      expect(response.body.meta).toHaveProperty('currentPage');
      expect(response.body.meta).toHaveProperty('totalPages');
      expect(response.body.meta).toHaveProperty('pageSize');
    } catch (error) {
      console.error('Error in GET all airports:', error);
      throw error;
    }
  });

  // Test GET single airport
  it('should get a single airport by ID', async () => {
    try {
      const response = await request(app).get(`/api/airports/${testAirportId}`);
      if (response.status !== 200) {
        console.error('Error in GET single airport by ID:', response.body);
      }
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testAirportId);
    } catch (error) {
      console.error('Error in GET single airport by ID:', error);
      throw error;
    }
  });

  // Test POST create airport
  it('should create a new airport', async () => {
    try {
      const response = await request(app)
        .post('/api/airports')
        .send({
          name: faker.address.city(),
          code: faker.datatype.uuid().slice(0, 3).toUpperCase(), 
          location: faker.address.city(),
          country: faker.address.country(),
        });
      if (response.status !== 201) {
        console.error('Error in POST create airport:', response.body);
      }
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name');
    } catch (error) {
      console.error('Error in POST create airport:', error);
      throw error;
    }
  });

  // Test PUT update airport
  it('should update an existing airport', async () => {
    const newLocation = faker.address.city();
    try {
      const response = await request(app)
        .put(`/api/airports/${testAirportId}`)
        .send({ location: newLocation });
      if (response.status !== 200) {
        console.error('Error in PUT update airport:', response.body);
      }
      expect(response.status).toBe(200);
      expect(response.body.location).toBe(newLocation);
    } catch (error) {
      console.error('Error in PUT update airport:', error);
      throw error;
    }
  });

  // Test DELETE airport
  it('should delete an airport', async () => {
    try {
      const response = await request(app).delete(`/api/airports/${testAirportId}`);
      if (response.status !== 204) {
        console.error('Error in DELETE airport:', response.body);
      }
      expect(response.status).toBe(204);
    } catch (error) {
      console.error('Error in DELETE airport:', error);
      throw error;
    }
  });

  // Clean up after tests
  afterAll(async () => {
    try {
      await prisma.$disconnect();
    } catch (error) {
      console.error('Error in afterAll:', error);
    }
  });
});

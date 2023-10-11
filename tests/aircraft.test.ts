import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import express from 'express';
import routes from '../src/routes';
import { faker } from '@faker-js/faker';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use('/', routes);

describe('Aircraft API', () => {
  let testAircraftId: string;

  // Create a new aircraft before running tests
  beforeAll(async () => {
    const response = await request(app)
      .post('/api/aircrafts')
      .send({
        model: faker.vehicle.model(),
        registration: faker.vehicle.vin(),
        manufacturer: faker.vehicle.manufacturer(),
        capacity: faker.number.int({ min: 50, max: 500 }), 
        status: 'in service',
      });
    testAircraftId = response.body.id;
  });

  // Test GET all aircrafts with pagination
  it('should get all aircrafts with pagination', async () => {
    try {
      const page = 1;
      const pageSize = 2;
      const response = await request(app).get(`/api/aircrafts?page=${page}&pageSize=${pageSize}`);
      if (response.status !== 200) {
        console.error('Error in GET all aircrafts with pagination:', response.body);
      }
      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.meta).toHaveProperty('totalItems');
      expect(response.body.meta).toHaveProperty('currentPage');
      expect(response.body.meta).toHaveProperty('totalPages');
      expect(response.body.meta).toHaveProperty('pageSize');
    } catch (error) {
      console.error('Error in GET all aircrafts with pagination:', error);
      throw error;
    }
  });

  // Test GET single aircraft
  it('should get a single aircraft by ID', async () => {
    try {
      const response = await request(app).get(`/api/aircrafts/${testAircraftId}`);
      if (response.status !== 200) {
        console.error('Error in GET single aircraft by ID:', response.body);
      }
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testAircraftId);
    } catch (error) {
      console.error('Error in GET single aircraft by ID:', error);
      throw error;
    }
  });

  // Test POST create aircraft
  it('should create a new aircraft', async () => {
    try {
      const response = await request(app)
        .post('/api/aircrafts')
        .send({
          model: faker.vehicle.model(),
          registration: faker.vehicle.vin(),
          manufacturer: faker.vehicle.manufacturer(),
          capacity: faker.number.int({ min: 50, max: 500 }), 
          status: 'under maintenance',
        });
      if (response.status !== 201) {
        console.error('Error in POST create aircraft:', response.body);
      }
      expect(response.status).toBe(201);
      expect(response.body.model).toBe(response.body.model);
    } catch (error) {
      console.error('Error in POST create aircraft:', error);
      throw error;
    }
  });

  // Test PUT update aircraft
  it('should update an existing aircraft', async () => {
    try {
      const response = await request(app)
        .put(`/api/aircrafts/${testAircraftId}`)
        .send({ status: 'retired' });
      if (response.status !== 200) {
        console.error('Error in PUT update aircraft:', response.body);
      }
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('retired');
    } catch (error) {
      console.error('Error in PUT update aircraft:', error);
      throw error;
    }
  });

  // Test DELETE aircraft
  it('should delete an aircraft', async () => {
    try {
      const response = await request(app).delete(`/api/aircrafts/${testAircraftId}`);
      if (response.status !== 204) {
        console.error('Error in DELETE aircraft:', response.body);
      }
      expect(response.status).toBe(204);
    } catch (error) {
      console.error('Error in DELETE aircraft:', error);
      throw error;
    }
  });

  // Clean up after tests
  afterAll(async () => {
    await prisma.$disconnect();
  });
});

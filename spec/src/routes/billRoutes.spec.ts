import request from 'supertest';
import express from 'express';
import billRoutes from '../../../src/routes/billRoutes';
import { getCurrentDateTimestamp } from '../../../src/handlers/utils';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const { JWT_SECRET } = process.env;

// Create an instance of the Express app for testing
const app = express();
app.use(express.json());
app.use('/bills', billRoutes);

describe('Bill Routes', () => {
  let authToken: string;
  let timestamp = getCurrentDateTimestamp();

  beforeAll(() => {
    // Generate a valid JWT token for testing
    authToken = jwt.sign(
      { id: 1, email: 'owner@fpt.com' },
      JWT_SECRET as string,
      { expiresIn: '120h' }
    );
  });

  it('should get all bills, which belongs to authenticated user_id', async () => {
    const response = await request(app)
      .get('/bills')
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should get bill by ID (Valid ID based on DB) or return error 404', async () => {
    const billId = 18; // Update ID based on test DB at the time of testing to get status 200
    const response = await request(app)
      .get(`/bills/${billId}`)
      .set('Authorization', `Bearer ${authToken}`);
    if (response.status === 200) {
      expect(response.body.id).toBe(billId);
    } else {
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Bill not found');
    }
  });

  it('should create a new bill', async () => {
    const newBill = {
      user_id: 1,
      order_ids: [1, 2, 3],
      amount_original: 1234.33,
      amount_payable: 999.99,
      status: `Pending ${timestamp}`,
    };
    const response = await request(app)
      .post('/bills')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBill);
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
  });

  it('should update bill by ID (Valid ID based on DB) or return error 404', async () => {
    const billId = 1; // Update ID based on test DB at the time of testing to get status 200
    const updatedBill = {
      user_id: 1,
      order_ids: [1, 2, 3],
      amount_original: 1234.33,
      amount_payable: 999.99,
      status: `Updated ${timestamp}`,
    };
    const response = await request(app)
      .put(`/bills/${billId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedBill);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(`Updated ${timestamp}`);
  });

  it('should delete bill by ID (Valid ID based on DB) or return error 404', async () => {
    const billId = 7; // Update ID based on test DB at the time of testing to get status 200
    const response = await request(app)
      .delete(`/bills/${billId}`)
      .set('Authorization', `Bearer ${authToken}`);
    if (response.status === 200) {
      expect(response.body.id).toBe(billId);
    } else {
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Bill not found');
    }
  });

  it('should return 401 Unauthorized when no token is provided', async () => {
    const response = await request(app).get('/bills');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  it('should return 403 Forbidden when token is invalid', async () => {
    const response = await request(app)
      .get('/bills')
      .set('Authorization', 'Bearer invalidtoken');
    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Forbidden');
  });
});

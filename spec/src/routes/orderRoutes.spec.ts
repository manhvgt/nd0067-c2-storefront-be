import request from 'supertest';
import express from 'express';
import orderRoutes from '../../../src/routes/orderRoutes';
import { getCurrentDateTimestamp } from '../../../src/handlers/utils';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const { JWT_SECRET } = process.env;

// Create an instance of the Express app for testing
const app = express();
app.use(express.json());
app.use('/orders', orderRoutes);

describe('Order Routes', () => {
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

  it('should get all orders, which belongs to authenticated user_id', async () => {
    const response = await request(app)
      .get('/orders')
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should get order by ID (Valid ID based on DB) or return error 404', async () => {
    const orderId = 1; // Update ID based on test DB at the time of testing to get status 200
    const response = await request(app)
      .get(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${authToken}`);
    if (response.status === 200) {
      expect(response.body.id).toBe(orderId);
    } else {
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Order not found');
    }
  });

  it('should create a new order', async () => {
    const newOrder = {
      product_id: 1,
      user_id: 1,
      quantity: 2,
      status: 'Pending',
      discount: 12.34,
      remark: `${timestamp}`,
    };
    const response = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newOrder);
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
  });

  it('should update order by ID (Valid ID based on DB) or return error 404', async () => {
    const orderId = 2; // Update ID based on test DB at the time of testing to get status 200
    const updatedOrder = {
      product_id: 1,
      user_id: 1,
      quantity: 2,
      status: 'Done',
      discount: 12.34,
      remark: `Updated ${timestamp}`,
    };
    const response = await request(app)
      .put(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedOrder);
    expect(response.status).toBe(200);
    expect(response.body.remark).toBe(`Updated ${timestamp}`);
  });

  it('should delete order by ID (Valid ID based on DB) or return error 404', async () => {
    const orderId = 123; // Update ID based on test DB at the time of testing to get status 200
    const response = await request(app)
      .delete(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${authToken}`);
    if (response.status === 200) {
      expect(response.body.id).toBe(orderId);
    } else {
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Order not found');
    }
  });

  it('should return 401 Unauthorized when no token is provided', async () => {
    const response = await request(app).get('/orders');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  it('should return 403 Forbidden when token is invalid', async () => {
    const response = await request(app)
      .get('/orders')
      .set('Authorization', 'Bearer invalidtoken');
    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Forbidden');
  });
});

import request from 'supertest';
import express from 'express';
import orderRoutes from '../../../src/routes/orderRoutes';
import * as utils from '../../../src/handlers/utils';
import { OrderModel, Order } from '../../../src/models/OrderModel';
import { UserModel, User } from '../../../src/models/UserModel';
import { ProductModel, Product } from '../../../src/models/ProductModel';
import pool from '../../../src/database';
import { decodeTokenString } from '../../../src/handlers/authHandler';
import dotenv from 'dotenv';

dotenv.config();
const { JWT_SECRET } = process.env;

// Create an instance of the Express app for testing
const app = express();
app.use(express.json());
app.use('/orders', orderRoutes);

describe('Order Routes', () => {
  let authToken: string;
  let orderModel: OrderModel;
  let userModel: UserModel;
  let productModel: ProductModel;
  let mockOrder: Order;
  const mockUser: User = {
    first_name: 'Test',
    last_name: 'User',
    email: `${utils.randomEmail()}`,
    mobile: `${utils.randomTimestamp()}`,
    gender: 'Other',
    role: 'User',
    password: 'password123',
  };
  const mockProduct: Product = {
    name: 'Test Product',
    category: 'Model Test',
    price: 100,
    stock: 10,
    remark: `${utils.getCurrentTimestamp()}`,
  };

  beforeAll(async() => {
    orderModel = new OrderModel();
    userModel = new UserModel();
    productModel = new ProductModel();
    await pool.query('BEGIN');

    const product = await productModel.create(mockProduct);
    authToken = await userModel.create(mockUser);
    const userId = decodeTokenString(authToken).id!;

    mockOrder = {
      product_id: product.id!,
      user_id: userId,
      quantity: 1,
      status: 'Pending',
      discount: 10,
      remark: `Remark${utils.getCurrentTimestamp()}`
    };
  });

  afterAll(async () => {
    await pool.query('ROLLBACK');
  });

  it('should get all orders, which belongs to authenticated user_id', async () => {
    await orderModel.create(mockOrder);
    const response = await request(app)
      .get('/orders')
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should get order by ID (Valid ID based on DB) or return error 404', async () => {
    const createdOrder = await orderModel.create(mockOrder);
    const orderId = createdOrder.id;
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
    const response = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send(mockOrder);
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
  });

  it('should update order by ID (Valid ID based on DB) or return error 404', async () => {
    const createdOrder = await orderModel.create(mockOrder);
    const orderId = createdOrder.id;
    let updateOrder: Order;
    updateOrder = {
      product_id: mockOrder.product_id,
      user_id: mockOrder.user_id,
      quantity: 1,
      status: 'Updated',
      discount: 10,
      remark: `Remark ${utils.getCurrentTimestamp()}`
    };
    const response = await request(app)
      .put(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateOrder);
    expect(response.status).toBe(200);
    expect(response.body.remark).toBe(updateOrder.remark);
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

import request from 'supertest';
import express from 'express';
import billRoutes from '../../../src/routes/billRoutes';
import { BillModel, Bill } from '../../../src/models/BillModel';
import { OrderModel, Order } from '../../../src/models/OrderModel';
import { UserModel, User } from '../../../src/models/UserModel';
import { ProductModel, Product } from '../../../src/models/ProductModel';
import pool from '../../../src/database';
import * as utils from '../../../src/handlers/utils';
import { decodeTokenString } from '../../../src/handlers/authHandler';

import dotenv from 'dotenv';

dotenv.config();
const { JWT_SECRET } = process.env;

// Create an instance of the Express app for testing
const app = express();
app.use(express.json());
app.use('/bills', billRoutes);

describe('Bill Routes', () => {
  let authToken: string;
  let billModel: BillModel;
  let orderModel: OrderModel;
  let userModel: UserModel;
  let productModel: ProductModel;
  let mockOrder: Order;
  let mockBill: Bill;

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
    billModel = new BillModel();
    orderModel = new OrderModel();
    userModel = new UserModel();
    productModel = new ProductModel();
    await pool.query('BEGIN');

    const product = await productModel.create(mockProduct);

    // Generate a valid JWT token for testing
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
    const order = await orderModel.create(mockOrder);
    const orderId = order.id!;

    mockBill = {
      user_id: userId,
      order_ids: [orderId],
      amount_original: 100,
      amount_payable: 90,
      status: `Pending ${utils.getCurrentTimestamp()}`,
    };

  });
  
  afterAll(async () => {
    await pool.query('ROLLBACK');
  });

  it('should get all bills, which belongs to authenticated user_id', async () => {
    await billModel.create(mockBill);
    const response = await request(app)
      .get('/bills')
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should get bill by ID (Valid ID based on DB) or return error 404', async () => {
    const createdBill = await billModel.create(mockBill);
    const billId = createdBill.id;
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
    const response = await request(app)
      .post('/bills')
      .set('Authorization', `Bearer ${authToken}`)
      .send(mockBill);
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
  });

  it('should update bill by ID (Valid ID based on DB) or return error 404', async () => {
    const createdBill = await billModel.create(mockBill);
    const billId = createdBill.id;
    mockBill.status = `Updated ${utils.getCurrentTimestamp()}`;

    const response = await request(app)
      .put(`/bills/${billId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(mockBill);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(mockBill.status);
  });

  it('should delete bill by ID (Valid ID based on DB) or return error 404', async () => {
    const createdBill = await billModel.create(mockBill);
    const billId = createdBill.id;
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

import request from 'supertest';
import express from 'express';
import productRoutes from '../../../src/routes/productRoutes';
import { getCurrentDateTimestamp } from '../../../src/handlers/utils';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const { JWT_SECRET } = process.env;

// Create an instance of the Express app for testing
const app = express();
app.use(express.json());
app.use('/products', productRoutes);

describe('Product Routes', () => {
  let authToken: string;
  let timestamp = getCurrentDateTimestamp();

  beforeAll(() => {
    // Generate a valid JWT token for testing
    authToken = jwt.sign(
      { id: 1, email: 'owner@fpt.com' },
      JWT_SECRET as string,
      { expiresIn: '120h' }
    );
    // console.debug(`${authToken}`);
  });

  it('should get all products', async () => {
    const response = await request(app).get('/products');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  // TODO: Update ID based on test DB at the time of testing to get status 200
  it('should get product by ID (Valid ID based on DB) or return error 404', async () => {
    const productId = 100;
    const response = await request(app).get(`/products/${productId}`);
    if (response.status === 200) {
      expect(response.body.id).toBe(productId);
    } else {
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Product not found');
    }
  });

  it('should create a new product', async () => {
    const newProduct = {
      name: `Product Name`,
      price: 1.2,
      category: 'Category',
      stock: 500,
      remark: `${timestamp}`,
    };
    const response = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newProduct);
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
  });

  it('should update product by ID (Valid ID based on DB) or return error 404', async () => {
    const productId = 1; // Update ID based on test DB at the time of testing to get status 200
    const updatedProduct = {
      name: 'Updated Product Name',
      price: 150.0,
      category: 'Updated Category',
      stock: 100,
      remark: `${timestamp}`,
    };
    const response = await request(app)
      .put(`/products/${productId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedProduct);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Product Name');
  });

  it('should delete product by ID (Valid ID based on DB) or return error 404', async () => {
    const productId = 100; // To Update ID based on test DB at the time of testing to get status 200
    const response = await request(app)
      .delete(`/products/${productId}`)
      .set('Authorization', `Bearer ${authToken}`);
    if (response.status === 200) {
      expect(response.body.id).toBe(productId);
    } else {
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Product not found');
    }
  });

  it('should return 401 Unauthorized when no token is provided', async () => {
    const response = await request(app).post('/products').send({
      name: 'Unauthorized Product',
      price: 100.0,
      category: 'Unauthorized Category',
    });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  it('should return 403 Forbidden when token is invalid', async () => {
    const response = await request(app)
      .post('/products')
      .set('Authorization', 'Bearer invalidtoken')
      .send({
        name: 'Invalid Token Product',
        price: 100.0,
        category: 'Invalid Token Category',
      });
    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Forbidden');
  });
});

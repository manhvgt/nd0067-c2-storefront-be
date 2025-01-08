import request from 'supertest';
import express from 'express';
import userRoutes from '../../../src/routes/userRoutes';
import { getCurrentTimestamp } from '../../../src/handlers/utils';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const { JWT_SECRET } = process.env;

// Create an instance of the Express app for testing
const app = express();
app.use(express.json());
app.use('/users', userRoutes);

describe('User Routes', () => {
  let authToken: string;
  let timestamp = getCurrentTimestamp();

  beforeAll(() => {
    // Generate a valid JWT token for testing
    authToken = jwt.sign(
      { id: 1, email: 'owner@fpt.com' },
      JWT_SECRET as string,
      { expiresIn: '120h' }
    );
  });

  it('should get all users', async () => {
    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should get user by ID (Valid ID based on DB) or return error 404', async () => {
    const userId = 1; // Update ID based on test DB at the time of testing to get status 200
    const response = await request(app)
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`);
    if (response.status === 200) {
      expect(response.body.id).toBe(userId);
    } else {
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    }
  });

  it('should create a new user', async () => {
    const newUser = {
      first_name: 'First',
      last_name: 'Last',
      email: `admin_${timestamp}@example.com`,
      mobile: `0123${timestamp}`,
      gender: 'Male',
      role: 'Admin',
      password: 'securepassword',
    };
    const response = await request(app).post('/users').send(newUser);
    expect(response.status).toBe(201);
    expect(response.body.token).toBeTruthy();
  });

  it('should update user by ID', async () => {
    const userId = 2; // Update ID based on test DB at the time of testing to get status 200
    const updatedUser = {
      first_name: 'Admin',
      last_name: 'Root',
      email: 'admin@fpt.com',
      mobile: '123456789',
      gender: 'Female',
      role: 'Admin',
      password: 'newpassword',
    };
    const response = await request(app)
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedUser);
    expect(response.status).toBe(200);
  });

  it('should delete user by ID (Valid ID based on DB) or return error 404', async () => {
    const userId = 9; // To Update ID based on test DB at the time of testing to get status 200
    const response = await request(app)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`);
    if (response.status === 200) {
      expect(response.body.id).toBe(userId);
    } else {
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    }
  });

  it('should return 401 Unauthorized when no token is provided', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  it('should return 403 Forbidden when token is invalid', async () => {
    const response = await request(app)
      .get('/users')
      .set('Authorization', 'Bearer invalidtoken');
    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Forbidden');
  });
});

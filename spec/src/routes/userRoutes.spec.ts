import request from 'supertest';
import express from 'express';
import userRoutes from '../../../src/routes/userRoutes';
import * as utils from '../../../src/handlers/utils';
import { UserModel, User } from '../../../src/models/UserModel';
import pool from '../../../src/database';
import { decodeTokenString } from '../../../src/handlers/authHandler';
import dotenv from 'dotenv';

dotenv.config();
const { JWT_SECRET } = process.env;

// Create an instance of the Express app for testing
const app = express();
app.use(express.json());
app.use('/users', userRoutes);

describe('User Routes', () => {
  let authToken: string;
  let userId: number;
  let userModel: UserModel;
  const mockUser: User = {
    first_name: 'Test',
    last_name: 'User',
    email: `${utils.randomEmail()}`,
    mobile: `${utils.randomTimestamp()}`,
    gender: 'Other',
    role: 'User',
    password: 'password123',
  };

  beforeAll(async() => {
    userModel = new UserModel();
    await pool.query('BEGIN');
    // Generate a valid JWT token for testing
    authToken = await userModel.create(mockUser);
    userId = decodeTokenString(authToken).id!;
  });

  afterAll(async () => {
    await pool.query('ROLLBACK');
  });

  it('should get all users', async () => {
    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should get user by ID (Valid ID based on DB) or return error 404', async () => {
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
    const newUser: User = {
      first_name: 'Test',
      last_name: 'User',
      email: `${utils.randomEmail()}`,
      mobile: `${utils.randomTimestamp()}`,
      gender: 'Other',
      role: 'User',
      password: 'password123',
    };
    const response = await request(app).post('/users').send(newUser);
    expect(response.status).toBe(201);
    expect(response.body.token).toBeTruthy();
  });

  it('should update user by ID', async () => {
    mockUser.first_name = 'Updated Name';
    const response = await request(app)
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(mockUser);
    expect(response.status).toBe(200);
    expect(response.body.first_name).toBe(mockUser.first_name);
  });

  it('should delete user by ID (Valid ID based on DB) or return error 404', async () => {
    mockUser.email = utils.randomEmail();
    mockUser.mobile = utils.randomTimestamp();
    const token = await userModel.create(mockUser);
    const createdUserId = decodeTokenString(token).id!;
    const response = await request(app)
      .delete(`/users/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`);
    if (response.status === 200) {
      expect(response.body.id).toBe(createdUserId);
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

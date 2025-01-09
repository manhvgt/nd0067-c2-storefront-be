import { UserModel, User } from '../../../src/models/UserModel';
import pool from '../../../src/database';
import { getCurrentTimestamp } from '../../../src/handlers/utils';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';  

dotenv.config();

describe('UserModel with Test Database', () => {
  let userModel: UserModel;
  const timestamp = getCurrentTimestamp();
  const mockUser: User = {
    first_name: 'Test',
    last_name: 'User',
    email: `test${timestamp}@example.com`,
    mobile: '1234567890',
    gender: 'Other',
    role: 'User',
    password: 'password123',
  };

  beforeAll(async () => {
    userModel = new UserModel();
    await pool.query('BEGIN');
  });

  afterEach(async () => {
    await pool.query('ROLLBACK');
    await pool.query('BEGIN');
  });

  afterAll(async () => {
    await pool.query('ROLLBACK');
  });

  it('should create a new user and return JWT', async () => {
    const token = await userModel.create(mockUser);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  it('should get a user by ID', async () => {
    const token = await userModel.create(mockUser);
    const payload: any = jwt.decode(token);
    const result = await userModel.getById(payload.id as number);
    expect(result.email).toEqual(mockUser.email);
  });

  it('should get a user by email', async () => {
    await userModel.create(mockUser);
    const result = await userModel.getByEmail(mockUser.email);
    expect(result?.email).toEqual(mockUser.email);
  });

  it('should get all users', async () => {
    await userModel.create(mockUser);
    const result = await userModel.getAll();
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it('should update a user by ID', async () => {
    const token = await userModel.create(mockUser);
    const payload: any = jwt.decode(token);
    const updatedUserData: User = {
      first_name: 'Updated',
      last_name: 'User',
      email: `updated${timestamp}@example.com`,
      mobile: '0987654321',
      gender: 'Other',
      role: 'User',
      password: 'newpassword123',
    };
    const updatedUser = await userModel.update(payload.id as number, updatedUserData);
    expect(updatedUser.email).toEqual(updatedUserData.email);
  });

  it('should delete a user by ID', async () => {
    const token = await userModel.create(mockUser);
    const payload: any = jwt.decode(token);
    const deletedUser = await userModel.delete(payload.id as number);
    expect(deletedUser.email).toEqual(mockUser.email);
  });

  it('should authenticate a user and return JWT', async () => {
    await userModel.create(mockUser);
    const token = await userModel.authenticate(mockUser.email, mockUser.password);
    expect(typeof token).toBe('string');
    expect(token?.length).toBeGreaterThan(0);
  });

  it('should return null for invalid authentication', async () => {
    const token = await userModel.authenticate('invalid@example.com', 'invalidpassword');
    expect(token).toBeNull();
  });
});

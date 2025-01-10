import { UserModel, User } from '../../../src/models/UserModel';
import pool from '../../../src/database';
import * as utils from '../../../src/handlers/utils';
import { decodeTokenString } from '../../../src/handlers/authHandler';
import dotenv from 'dotenv';

dotenv.config();

describe('UserModel with Test Database', () => {
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
    mockUser.email = utils.randomEmail();
    mockUser.mobile = utils.randomTimestamp();
    const token = await userModel.create(mockUser);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  it('should get a user by ID', async () => {
    mockUser.email = utils.randomEmail();
    mockUser.mobile = utils.randomTimestamp();
    const token = await userModel.create(mockUser);
    const userId = decodeTokenString(token).id!;
    const result = await userModel.getById(userId as number);
    expect(result.email).toEqual(mockUser.email);
  });

  it('should get a user by email', async () => {
    mockUser.email = utils.randomEmail();
    mockUser.mobile = utils.randomTimestamp();
    await userModel.create(mockUser);
    const result = await userModel.getByEmail(mockUser.email);
    expect(result?.email).toEqual(mockUser.email);
  });

  it('should get all users', async () => {
    mockUser.email = utils.randomEmail();
    mockUser.mobile = utils.randomTimestamp();
    await userModel.create(mockUser);
    const result = await userModel.getAll();
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it('should update a user by ID', async () => {
    mockUser.email = utils.randomEmail();
    mockUser.mobile = utils.randomTimestamp();
    const token = await userModel.create(mockUser);
    const userId = decodeTokenString(token).id!;
    const updatedUserData: User = {
      first_name: 'Updated',
      last_name: 'User',
      email: `${utils.randomEmail()}`,
      mobile: `${utils.randomTimestamp()}`,
      gender: 'Other',
      role: 'User',
      password: 'newpassword123',
    };
    const updatedUser = await userModel.update(userId as number, updatedUserData);
    expect(updatedUser.email).toEqual(updatedUserData.email);
  });

  it('should delete a user by ID', async () => {
    mockUser.email = utils.randomEmail();
    mockUser.mobile = utils.randomTimestamp();
    const token = await userModel.create(mockUser);
    const userId = decodeTokenString(token).id!;
    const deletedUser = await userModel.delete(userId as number);
    expect(deletedUser.email).toEqual(mockUser.email);
  });

  it('should authenticate a user and return JWT', async () => {
    mockUser.email = utils.randomEmail();
    mockUser.mobile = utils.randomTimestamp();
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

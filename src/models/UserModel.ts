import pool from '../database';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export type User = {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  gender: string;
  role: string;
  password: string;
  password_hash?: string;
};

const { BCRYPT_PASSWORD, SALT_ROUNDS, JWT_SECRET } = process.env;

export class UserModel {
  // Create a new user and return JWT
  async create(user: User): Promise<string> {
    try {
      const conn = await pool.connect();
      const sql = `INSERT INTO "User" (first_name, last_name, email, mobile, gender, role, password_hash) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
      const hash = bcrypt.hashSync(
        user.password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS as string, 10)
      );
      const result = await conn.query(sql, [
        user.first_name,
        user.last_name,
        user.email,
        user.mobile,
        user.gender,
        user.role,
        hash,
      ]);
      conn.release();
      const newUser = result.rows[0];
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        JWT_SECRET as string,
        { expiresIn: '120h' }
      );
      return token;
    } catch (err) {
      throw new Error(`Unable to create user: ${err}`);
    }
  }

  // Read user by ID
  async getById(id: number): Promise<User> {
    try {
      const conn = await pool.connect();
      const sql = `SELECT * FROM "User" WHERE id=$1`;
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to get user: ${err}`);
    }
  }

  // Read user by Email
  async getByEmail(email: string): Promise<User | null> {
    try {
      const conn = await pool.connect();
      const sql = `SELECT * FROM "User" WHERE email=$1`;
      const result = await conn.query(sql, [email]);
      conn.release();
      return result.rows.length ? result.rows[0] : null;
    } catch (err) {
      throw new Error(`Unable to get user: ${err}`);
    }
  }

  // Read all users
  async getAll(): Promise<User[]> {
    try {
      const conn = await pool.connect();
      const sql = `SELECT * FROM "User"`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get users: ${err}`);
    }
  }

  // Update user by ID
  async update(id: number, user: User): Promise<User> {
    try {
      const conn = await pool.connect();
      const sql = `UPDATE "User" SET first_name=$1, last_name=$2, email=$3, mobile=$4, role=$5, password_hash=$6 
                   WHERE id=$7 RETURNING *`;
      const hash = bcrypt.hashSync(
        user.password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS as string, 10)
      );
      const result = await conn.query(sql, [
        user.first_name,
        user.last_name,
        user.email,
        user.mobile,
        user.role,
        hash,
        id,
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to update user: ${err}`);
    }
  }

  // Delete user by ID
  async delete(id: number): Promise<User> {
    try {
      const conn = await pool.connect();
      const sql = `DELETE FROM "User" WHERE id=$1 RETURNING *`;
      const result = await conn.query(sql, [id]);
      conn.release();
      if (result.rows.length === 0) {
        throw new Error('User not found');
      }
      return result.rows[0];
    } catch (err) {
      if (err instanceof Error && err.message === 'User not found') {
        throw { status: 404, message: err.message };
      }
      throw new Error(`Unable to delete user: ${err}`);
    }
  }

  // Authenticate user and generate JWT token
  async authenticate(email: string, password: string): Promise<string | null> {
    try {
      const conn = await pool.connect();
      const sql = `SELECT * FROM "User" WHERE email=$1`;
      const result = await conn.query(sql, [email]);
      if (result.rows.length) {
        const user = result.rows[0];
        if (
          bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password_hash)
        ) {
          const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET as string,
            { expiresIn: '120h' }
          );
          conn.release();
          return token;
        }
      }
      conn.release();
      return null;
    } catch (err) {
      throw new Error(`Unable to authenticate user: ${err}`);
    }
  }
}

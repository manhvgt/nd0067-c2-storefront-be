import pool from '../database';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

export type Customer = {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  gender: string;
  password: string;
  password_hash?: string;
};

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

export class CustomerModel {
  // Create a new customer
  async create(customer: Customer): Promise<Customer> {
    try {
      const conn = await pool.connect();
      const sql = `INSERT INTO "Customer" (first_name, last_name, email, mobile, gender, password_hash) 
                   VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
      const hash = bcrypt.hashSync(
        customer.password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS as string, 10)
      );
      const result = await conn.query(sql, [
        customer.first_name,
        customer.last_name,
        customer.email,
        customer.mobile,
        customer.gender,
        hash
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to create customer: ${err}`);
    }
  }

  // Read customer by ID
  async getById(id: number): Promise<Customer> {
    try {
      const conn = await pool.connect();
      const sql = `SELECT * FROM "Customer" WHERE id=$1`;
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to get customer: ${err}`);
    }
  }

  // Read customer by Email
  async getByEmail(email: string): Promise<Customer | null> {
    try {
      const conn = await pool.connect();
      const sql = `SELECT * FROM "Customer" WHERE email=$1`;
      const result = await conn.query(sql, [email]);
      conn.release();
      return result.rows.length ? result.rows[0] : null;
    } catch (err) {
      throw new Error(`Unable to get customer: ${err}`);
    }
  }

  // Read all customers
  async getAll(): Promise<Customer[]> {
    try {
      const conn = await pool.connect();
      const sql = `SELECT * FROM "Customer"`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get customers: ${err}`);
    }
  }

  // Update customer by ID
  async update(id: number, customer: Customer): Promise<Customer> {
    try {
      const conn = await pool.connect();
      const sql = `UPDATE "Customer" SET first_name=$1, last_name=$2, email=$3, mobile=$4, gender=$5, password_hash=$6 
                   WHERE id=$7 RETURNING *`;
      const hash = bcrypt.hashSync(
        customer.password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS as string, 10)
      );
      const result = await conn.query(sql, [
        customer.first_name,
        customer.last_name,
        customer.email,
        customer.mobile,
        customer.gender,
        hash,
        id,
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to update customer: ${err}`);
    }
  }

  // Delete customer by ID
  async delete(id: number): Promise<Customer> {
    try {
      const conn = await pool.connect();
      const sql = `DELETE FROM "Customer" WHERE id=$1 RETURNING *`;
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to delete customer: ${err}`);
    }
  }

  // Authenticate customer by password
  async authenticate(email: string, password: string): Promise<Customer | null> {
    try {
      const conn = await pool.connect();
      const sql = `SELECT * FROM "Customer" WHERE email=$1`;
      const result = await conn.query(sql, [email]);
      if (result.rows.length) {
        const customer = result.rows[0];
        if (bcrypt.compareSync(password + BCRYPT_PASSWORD, customer.password_hash)) {
          return customer;
        }
      }
      conn.release();
      return null;
    } catch (err) {
      throw new Error(`Unable to authenticate customer: ${err}`);
    }
  }
}

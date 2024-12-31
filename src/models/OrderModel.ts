import pool from '../database';

export type Order = {
  id?: number;
  product_id: number;
  customer_id: number;
  quantity: number;
  status: string;
  datetime?: string;
  discount?: number;
  remark?: string;
};

export class OrderModel {
  // Create a new order
  async create(order: Order): Promise<Order> {
    try {
      const conn = await pool.connect();
      const sql = `INSERT INTO "Order" (product_id, customer_id, quantity, status, datetime, discount, remark) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
      const result = await conn.query(sql, [
        order.product_id,
        order.customer_id,
        order.quantity,
        order.status,
        order.datetime,
        order.discount,
        order.remark
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to create order: ${err}`);
    }
  }

  // Read order by ID
  async getById(id: number): Promise<Order> {
    try {
      const conn = await pool.connect();
      const sql = `SELECT * FROM "Order" WHERE id=$1`;
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to get order: ${err}`);
    }
  }

  // Read all orders
  async getAll(): Promise<Order[]> {
    try {
      const conn = await pool.connect();
      const sql = `SELECT * FROM "Order"`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get orders: ${err}`);
    }
  }

  // Update order by ID
  async update(id: number, order: Order): Promise<Order> {
    try {
      const conn = await pool.connect();
      const sql = `UPDATE "Order" SET product_id=$1, customer_id=$2, quantity=$3, status=$4, datetime=$5, discount=$6, remark=$7 
                   WHERE id=$8 RETURNING *`;
      const result = await conn.query(sql, [
        order.product_id,
        order.customer_id,
        order.quantity,
        order.status,
        order.datetime,
        order.discount,
        order.remark,
        id,
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to update order: ${err}`);
    }
  }

  // Delete order by ID
  async delete(id: number): Promise<Order> {
    try {
      const conn = await pool.connect();
      const sql = `DELETE FROM "Order" WHERE id=$1 RETURNING *`;
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to delete order: ${err}`);
    }
  }
}

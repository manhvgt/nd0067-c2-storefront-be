import pool from '../database';

export type Order = {
  id?: number;
  product_id: number;
  user_id: number;
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
      const sql = `INSERT INTO "Order" (product_id, user_id, quantity, status, discount, remark) 
                   VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
      const result = await conn.query(sql, [
        order.product_id,
        order.user_id,
        order.quantity,
        order.status,
        order.discount,
        order.remark,
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to create order: ${err}`);
    }
  }

  // Get all orders
  async getAll(): Promise<Order[]> {
    try {
      const conn = await pool.connect();
      const sql = 'SELECT * FROM "Order"';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get orders: ${err}`);
    }
  }

  // Get order by ID
  async getById(id: number): Promise<Order> {
    try {
      const conn = await pool.connect();
      const sql = 'SELECT * FROM "Order" WHERE id=$1';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to get order: ${err}`);
    }
  }

  // Update order by ID
  async update(id: number, order: Order): Promise<Order> {
    try {
      const conn = await pool.connect();
      const sql = `UPDATE "Order" SET product_id=$1, user_id=$2, quantity=$3, status=$4, discount=$5, remark=$6 
                   WHERE id=$7 RETURNING *`;
      const result = await conn.query(sql, [
        order.product_id,
        order.user_id,
        order.quantity,
        order.status,
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

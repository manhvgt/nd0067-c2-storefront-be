import pool from '../database';

export type OrderProduct = {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
};

export class OrderProductModel {
  // Create a new order_products
  async create(orderProduct: OrderProduct): Promise<OrderProduct> {
    try {
      const conn = await pool.connect();
      const sql = `INSERT INTO "Order_products" (order_id, product_id, quantity) 
                   VALUES ($1, $2, $3) RETURNING *`;
      const result = await conn.query(sql, [
        orderProduct.order_id,
        orderProduct.product_id,
        orderProduct.quantity,
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to create order product: ${err}`);
    }
  }

  // Get order_products by ID
  async getById(id: number): Promise<OrderProduct> {
    try {
      const conn = await pool.connect();
      const sql = `SELECT * FROM "Order_products" WHERE id=$1`;
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to get order product: ${err}`);
    }
  }

  // Get all order_products
  async getAll(): Promise<OrderProduct[]> {
    try {
      const conn = await pool.connect();
      const sql = `SELECT * FROM "Order_products"`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get order products: ${err}`);
    }
  }

  // Get order_products by order_id
  async getByOrderId(orderId: number): Promise<OrderProduct[]> {
    try {
      const conn = await pool.connect();
      const sql = `SELECT * FROM "Order_products" WHERE order_id=$1`;
      const result = await conn.query(sql, [orderId]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get order products for order ID ${orderId}: ${err}`);
    }
  }

  // Update order_products by ID
  async update(id: number, orderProduct: OrderProduct): Promise<OrderProduct> {
    try {
      const conn = await pool.connect();
      const sql = `UPDATE "Order_products" SET order_id=$1, product_id=$2, quantity=$3 
                   WHERE id=$4 RETURNING *`;
      const result = await conn.query(sql, [
        orderProduct.order_id,
        orderProduct.product_id,
        orderProduct.quantity,
        id,
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to update order product: ${err}`);
    }
  }

  // Delete order_products by ID
  async delete(id: number): Promise<OrderProduct> {
    try {
      const conn = await pool.connect();
      const sql = `DELETE FROM "Order_products" WHERE id=$1 RETURNING *`;
      const result = await conn.query(sql, [id]);
      conn.release();
      if (result.rows.length === 0) {
        throw new Error('Order product not found');
      }
      return result.rows[0];
    } catch (err) {
      if (err instanceof Error && err.message === 'Order product not found') {
        throw { status: 404, message: err.message };
      }
      throw new Error(`Unable to delete order product: ${err}`);
    }
  }
}

import pool from '../database';

export type Bill = {
  id?: number;
  user_id: number;
  customer_id: number;
  order_ids: number[];
  datetime?: string;
  amount_original: number;
  amount_payable: number;
  status: string;
};

export class BillModel {
  // Create a new bill
  async create(bill: Bill): Promise<Bill> {
    try {
      const conn = await pool.connect();
      const sql = `INSERT INTO "Bill" (user_id, customer_id, order_ids, datetime, amount_original, amount_payable, status) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
      const result = await conn.query(sql, [
        bill.user_id,
        bill.customer_id,
        bill.order_ids,
        bill.datetime,
        bill.amount_original,
        bill.amount_payable,
        bill.status
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to create bill: ${err}`);
    }
  }

  // Read bill by ID
  async getById(id: number): Promise<Bill> {
    try {
      const conn = await pool.connect();
      const sql = `SELECT * FROM "Bill" WHERE id=$1`;
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to get bill: ${err}`);
    }
  }

  // Read all bills
  async getAll(): Promise<Bill[]> {
    try {
      const conn = await pool.connect();
      const sql = `SELECT * FROM "Bill"`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get bills: ${err}`);
    }
  }

  // Update bill by ID
  async update(id: number, bill: Bill): Promise<Bill> {
    try {
      const conn = await pool.connect();
      const sql = `UPDATE "Bill" SET user_id=$1, customer_id=$2, order_ids=$3, datetime=$4, amount_original=$5, amount_payable=$6, status=$7 
                   WHERE id=$8 RETURNING *`;
      const result = await conn.query(sql, [
        bill.user_id,
        bill.customer_id,
        bill.order_ids,
        bill.datetime,
        bill.amount_original,
        bill.amount_payable,
        bill.status,
        id,
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to update bill: ${err}`);
    }
  }

  // Delete bill by ID
  async delete(id: number): Promise<Bill> {
    try {
      const conn = await pool.connect();
      const sql = `DELETE FROM "Bill" WHERE id=$1 RETURNING *`;
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to delete bill: ${err}`);
    }
  }
}

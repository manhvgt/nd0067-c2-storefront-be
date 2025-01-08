import pool from '../database';

export type Bill = {
  id?: number;
  user_id: number;
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
      const sql = `INSERT INTO "Bill" (user_id, order_ids, amount_original, amount_payable, status) 
                   VALUES ($1, $2, $3, $4, $5) RETURNING *`;
      const result = await conn.query(sql, [
        bill.user_id,
        bill.order_ids,
        bill.amount_original,
        bill.amount_payable,
        bill.status,
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to create bill: ${err}`);
    }
  }

  // Get all bills
  async getAll(): Promise<Bill[]> {
    try {
      const conn = await pool.connect();
      const sql = 'SELECT * FROM "Bill"';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get bills: ${err}`);
    }
  }

  // Get all bills by user_id
  async getByUserId(userId: number): Promise<Bill[]> {
    try {
      const conn = await pool.connect();
      const sql = 'SELECT * FROM "Bill" WHERE user_id=$1';
      const result = await conn.query(sql, [userId]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get bills for user ID ${userId}: ${err}`);
    }
  }

  // Get bill by ID
  async getById(id: number): Promise<Bill> {
    try {
      const conn = await pool.connect();
      const sql = 'SELECT * FROM "Bill" WHERE id=$1';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to get bill: ${err}`);
    }
  }

  // Update bill by ID
  async update(id: number, bill: Bill): Promise<Bill> {
    try {
      const conn = await pool.connect();
      const sql = `UPDATE "Bill" SET user_id=$1, order_ids=$2, amount_original=$3, amount_payable=$4, status=$5 
                   WHERE id=$6 RETURNING *`;
      const result = await conn.query(sql, [
        bill.user_id,
        bill.order_ids,
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
      if (result.rows.length === 0) {
        throw new Error('Bill not found');
      }  
      return result.rows[0];
    } catch (err) {
      if (err instanceof Error && err.message === 'Bill not found') {
        throw { status: 404, message: err.message };
      }
      throw new Error(`Unable to delete bill: ${err}`);
    }
  }
}

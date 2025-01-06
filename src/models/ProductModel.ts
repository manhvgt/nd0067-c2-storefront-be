import pool from '../database';

export type Product = {
  id?: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  remark?: string;
};

export class ProductModel {
  // Create a new product
  async create(product: Product): Promise<Product> {
    try {
      const conn = await pool.connect();
      const sql = `INSERT INTO "Product" (name, category, price, stock, remark) 
                   VALUES ($1, $2, $3, $4, $5) RETURNING *`;
      const result = await conn.query(sql, [
        product.name,
        product.category,
        product.price,
        product.stock,
        product.remark
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to create product: ${err}`);
    }
  }

  // Read product by ID
  async getById(id: number): Promise<Product> {
    try {
      const conn = await pool.connect();
      const sql = `SELECT * FROM "Product" WHERE id=$1`;
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to get product: ${err}`);
    }
  }

  // Read all products
  async getAll(): Promise<Product[]> {
    try {
      const conn = await pool.connect();
      const sql = `SELECT * FROM "Product"`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get products: ${err}`);
    }
  }

  // Update product by ID
  async update(id: number, product: Product): Promise<Product> {
    try {
      const conn = await pool.connect();
      const sql = `UPDATE "Product" SET name=$1, category=$2, price=$3, stock=$4, remark=$5 
                   WHERE id=$6 RETURNING *`;
      const result = await conn.query(sql, [
        product.name,
        product.category,
        product.price,
        product.stock,
        product.remark,
        id,
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to update product: ${err}`);
    }
  }

  // Delete product by ID
  async delete(id: number): Promise<Product> {
    try {
      const conn = await pool.connect();
      const sql = `DELETE FROM "Product" WHERE id=$1 RETURNING *`;
      const result = await conn.query(sql, [id]);
      conn.release();
      if (result.rows.length === 0) {
        throw new Error('Product not found');
      }
      return result.rows[0];
    } catch (err) {
      if (err instanceof Error && err.message === 'Product not found') {
        throw { status: 404, message: err.message };
      }
      throw new Error(`Unable to delete product: ${err}`);
    }
  }
}

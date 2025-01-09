import { ProductModel, Product } from '../../../src/models/ProductModel';
import pool from '../../../src/database';
import { getCurrentTimestamp } from '../../../src/handlers/utils';

describe('ProductModel with Test Database', () => {
    let productModel: ProductModel;
    let timestamp = getCurrentTimestamp();
    const mockProduct: Product = {
        name: 'Test Product',
        category: 'Model Test',
        price: 100,
        stock: 10,
        remark: `${timestamp}`,
    };

    beforeAll(async () => {
        productModel = new ProductModel();
        await pool.query('BEGIN');
    });

    afterEach(async () => {
        await pool.query('ROLLBACK');
        await pool.query('BEGIN');
    });

    afterAll(async () => {
        await pool.query('ROLLBACK');
    });

    it('should create a new product', async () => {
        const result = await productModel.create(mockProduct);
        expect(result.remark).toEqual(timestamp);
    });

    it('should get a product by ID', async () => {
        const createdProduct = await productModel.create(mockProduct);
        const result = await productModel.getById(createdProduct.id as number);
        expect(result).toEqual(createdProduct);
    });

    it('should get all products', async () => {
        await productModel.create(mockProduct);
        const result = await productModel.getAll();
        expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it('should update a product by ID', async () => {
        const createdProduct = await productModel.create(mockProduct);
        const updatedProductData: Product = {
            name: 'Updated Product',
            category: 'Updated Category',
            price: 150,
            stock: 15,
            remark: 'Updated Remark',
        };
        const updatedProduct = await productModel.update(createdProduct.id as number, updatedProductData);
        expect(updatedProduct.name).toEqual(updatedProductData.name);
    });

    it('should delete a product by ID', async () => {
        const createdProduct = await productModel.create(mockProduct);
        const deletedProduct = await productModel.delete(createdProduct.id as number);
        expect(deletedProduct).toEqual(createdProduct);
    });
});

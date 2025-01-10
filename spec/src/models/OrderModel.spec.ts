import { OrderModel, Order } from '../../../src/models/OrderModel';
import { UserModel, User } from '../../../src/models/UserModel';
import { ProductModel, Product } from '../../../src/models/ProductModel';
import pool from '../../../src/database';
import * as utils from '../../../src/handlers/utils';
import { decodeTokenString } from '../../../src/handlers/authHandler';
import dotenv from 'dotenv';

dotenv.config();

describe('OrderModel with Test Database', () => {
  let orderModel: OrderModel;
  let userModel: UserModel;
  let productModel: ProductModel;
  let mockOrder: Order;

  const mockUser: User = {
    first_name: 'Test',
    last_name: 'User',
    email: `${utils.randomEmail()}`,
    mobile: `${utils.randomTimestamp()}`,
    gender: 'Other',
    role: 'User',
    password: 'password123',
  };
  const mockProduct: Product = {
    name: 'Test Product',
    category: 'Model Test',
    price: 100,
    stock: 10,
    remark: `${utils.getCurrentTimestamp()}`,
  };

  beforeAll(async () => {
    orderModel = new OrderModel();
    userModel = new UserModel();
    productModel = new ProductModel();
    await pool.query('BEGIN');

    const product = await productModel.create(mockProduct);
    const token = await userModel.create(mockUser);
    const userId = decodeTokenString(token).id!;

    mockOrder = {
      product_id: product.id!,
      user_id: userId,
      quantity: 1,
      status: 'Pending',
      discount: 10,
      remark: `Remark${utils.getCurrentTimestamp()}`
    };
  });

  // afterEach(async () => {
  //   await pool.query('ROLLBACK');
  //   await pool.query('BEGIN');
  // });

  afterAll(async () => {
    await pool.query('ROLLBACK');
  });

  it('should create a new order', async () => {
    const result = await orderModel.create(mockOrder);
    expect(result.remark).toEqual(mockOrder.remark);
  });

  it('should get an order by ID', async () => {
    const createdOrder = await orderModel.create(mockOrder);
    const result = await orderModel.getById(createdOrder.id as number);
    expect(result).toEqual(createdOrder);
  });

  it('should get all orders', async () => {
    await orderModel.create(mockOrder);
    const result = await orderModel.getAll();
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it('should get orders by user ID', async () => {
    await orderModel.create(mockOrder);
    const result = await orderModel.getByUserId(mockOrder.user_id);
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it('should update an order by ID', async () => {
    const createdOrder = await orderModel.create(mockOrder);
    const updatedOrderData: Order = {
      product_id: createdOrder.product_id,
      user_id: createdOrder.user_id,
      quantity: 2,
      status: 'Shipped',
      discount: 5,
      remark: 'Updated'
    };
    const updatedOrder = await orderModel.update(createdOrder.id as number, updatedOrderData);
    expect(updatedOrder.quantity).toEqual(updatedOrderData.quantity);
    expect(updatedOrder.status).toEqual(updatedOrderData.status);
  });

  it('should delete an order by ID', async () => {
    const createdOrder = await orderModel.create(mockOrder);
    const deletedOrder = await orderModel.delete(createdOrder.id as number);
    expect(deletedOrder).toEqual(createdOrder);
  });
});

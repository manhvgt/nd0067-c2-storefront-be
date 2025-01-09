import { OrderModel, Order } from '../../../src/models/OrderModel';
import pool from '../../../src/database';
import { getCurrentTimestamp } from '../../../src/handlers/utils';
import dotenv from 'dotenv';

dotenv.config();

describe('OrderModel with Test Database', () => {
  let orderModel: OrderModel;
  let mockOrder: Order;
  const timestamp = getCurrentTimestamp();

  beforeAll(async () => {
    orderModel = new OrderModel();
    await pool.query('BEGIN');

    mockOrder = {
      product_id: 1,
      user_id: 1,
      quantity: 1,
      status: 'Pending',
      discount: 10,
      remark: `Remark${timestamp}`
    };
  });

  afterEach(async () => {
    await pool.query('ROLLBACK');
    await pool.query('BEGIN');
  });

  afterAll(async () => {
    await pool.query('ROLLBACK');
  });

  it('should create a new order', async () => {
    const result = await orderModel.create(mockOrder);
    expect(result.remark).toEqual(`Remark${timestamp}`);
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

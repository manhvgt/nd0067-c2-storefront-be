import { BillModel, Bill } from '../../../src/models/BillModel';
import { OrderModel, Order } from '../../../src/models/OrderModel';
import { UserModel, User } from '../../../src/models/UserModel';
import { ProductModel, Product } from '../../../src/models/ProductModel';
import pool from '../../../src/database';
import * as utils from '../../../src/handlers/utils';
import { decodeTokenString } from '../../../src/handlers/authHandler';
import dotenv from 'dotenv';

dotenv.config();

describe('BillModel with Test Database', () => {
  let billModel: BillModel;
  let orderModel: OrderModel;
  let userModel: UserModel;
  let productModel: ProductModel;
  let mockOrder: Order;
  let mockBill: Bill;

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
    billModel = new BillModel();
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

    const order = await orderModel.create(mockOrder);
    const orderId = order.id!;
    mockBill = {
      user_id: userId,
      order_ids: [orderId],
      amount_original: 100,
      amount_payable: 90,
      status: `Pending ${utils.getCurrentTimestamp()}`,
    };
  });

  // afterEach(async () => {
  //   await pool.query('ROLLBACK');
  //   await pool.query('BEGIN');
  // });

  afterAll(async () => {
    await pool.query('ROLLBACK');
  });

  it('should create a new bill', async () => {
    const result = await billModel.create(mockBill);
    expect(result.status).toEqual(mockBill.status);
  });

  it('should get a bill by ID', async () => {
    const createdBill = await billModel.create(mockBill);
    const result = await billModel.getById(createdBill.id as number);
    expect(result).toEqual(createdBill);
  });

  it('should get all bills', async () => {
    await billModel.create(mockBill);
    const result = await billModel.getAll();
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it('should get bills by user ID', async () => {
    await billModel.create(mockBill);
    const result = await billModel.getByUserId(mockBill.user_id);
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it('should update a bill by ID', async () => {
    const createdBill = await billModel.create(mockBill);
    const updatedBillData: Bill = {
      user_id: createdBill.user_id,
      order_ids: createdBill.order_ids,
      amount_original: 150,
      amount_payable: 135,
      status: `Done ${utils.getCurrentTimestamp()}`,
    };
    const updatedBill = await billModel.update(createdBill.id as number, updatedBillData);
    expect(updatedBill.status).toEqual(updatedBillData.status);
  });

  it('should delete a bill by ID', async () => {
    const createdBill = await billModel.create(mockBill);
    const deletedBill = await billModel.delete(createdBill.id as number);
    expect(deletedBill).toEqual(createdBill);
  });
});

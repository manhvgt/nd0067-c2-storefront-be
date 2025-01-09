import { BillModel, Bill } from '../../../src/models/BillModel';
import pool from '../../../src/database';
import { getCurrentTimestamp } from '../../../src/handlers/utils';
import dotenv from 'dotenv';

dotenv.config();

describe('BillModel with Test Database', () => {
  let billModel: BillModel;
  let mockBill: Bill;
  const timestamp = getCurrentTimestamp();

  beforeAll(async () => {
    billModel = new BillModel();
    await pool.query('BEGIN');

    mockBill = {
      user_id: 1,
      order_ids: [1, 2, 3],
      amount_original: 100,
      amount_payable: 90,
      status: `Pending ${timestamp}`,
    };
  });

  afterEach(async () => {
    await pool.query('ROLLBACK');
    await pool.query('BEGIN');
  });

  afterAll(async () => {
    await pool.query('ROLLBACK');
  });

  it('should create a new bill', async () => {
    const result = await billModel.create(mockBill);
    expect(result.status).toEqual(`Pending ${timestamp}`);
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
      status: `Done ${timestamp}`,
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

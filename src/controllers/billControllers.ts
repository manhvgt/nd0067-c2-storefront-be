import { Request, Response } from 'express';
import { BillModel, Bill } from '../models/BillModel';
import { handleError } from '../handlers/errorHandler';

const billModel = new BillModel();

// Show all bills
export const index = async (req: Request, res: Response) => {
  try {
    const bills = await billModel.getAll();
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
};

// Show bill detail by ID
export const show = async (req: Request, res: Response) => {
  try {
    const bill = await billModel.getById(parseInt(req.params.id, 10));
    if (bill) {
      res.json(bill);
    } else {
      res.status(404).json({ message: 'Bill not found' });
    }
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
};

// Create new bill
export const create = async (req: Request, res: Response) => {
  try {
    const bill: Bill = req.body;
    const newBill = await billModel.create(bill);
    res.status(201).json(newBill);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
};

// Update bill by ID
export const update = async (req: Request, res: Response) => {
  try {
    const bill: Bill = req.body;
    const updatedBill = await billModel.update(parseInt(req.params.id, 10), bill);
    res.json(updatedBill);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
};

// Delete bill by ID
export const remove = async (req: Request, res: Response) => {
  try {
    const deletedBill = await billModel.delete(parseInt(req.params.id, 10));
    res.json(deletedBill);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
};

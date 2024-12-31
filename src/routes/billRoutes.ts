import express from 'express';
import { BillModel, Bill } from '../models/BillModel';
import { handleError } from '../handlers/errorHandler';

const router = express.Router();
const billModel = new BillModel();

// GET all bills
router.get('/', async (req, res) => {
  try {
    const bills = await billModel.getAll();
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
});

// GET bill by ID
router.get('/:id', async (req, res) => {
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
});

// CREATE a new bill
router.post('/', async (req, res) => {
  try {
    const bill: Bill = req.body;
    const newBill = await billModel.create(bill);
    res.status(201).json(newBill);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
});

// UPDATE a bill by ID
router.put('/:id', async (req, res) => {
  try {
    const bill: Bill = req.body;
    const updatedBill = await billModel.update(parseInt(req.params.id, 10), bill);
    res.json(updatedBill);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
});

// DELETE a bill by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedBill = await billModel.delete(parseInt(req.params.id, 10));
    res.json(deletedBill);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
});

export default router;

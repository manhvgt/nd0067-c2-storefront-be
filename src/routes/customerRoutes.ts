import express from 'express';
import { CustomerModel, Customer } from '../models/CustomerModel';
import { handleError } from '../handlers/errorHandler';

const router = express.Router();
const customerModel = new CustomerModel();

// GET all customers
router.get('/', async (req, res) => {
  try {
    const customers = await customerModel.getAll();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
});

// GET customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await customerModel.getById(parseInt(req.params.id, 10));
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
});

// CREATE a new customer
router.post('/', async (req, res) => {
  try {
    const customer: Customer = req.body;
    const newCustomer = await customerModel.create(customer);
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
});

// UPDATE a customer by ID
router.put('/:id', async (req, res) => {
  try {
    const customer: Customer = req.body;
    const updatedCustomer = await customerModel.update(parseInt(req.params.id, 10), customer);
    res.json(updatedCustomer);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
});

// DELETE a customer by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedCustomer = await customerModel.delete(parseInt(req.params.id, 10));
    res.json(deletedCustomer);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
});

export default router;

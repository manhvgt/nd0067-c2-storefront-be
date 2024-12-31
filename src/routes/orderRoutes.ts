import express from 'express';
import { OrderModel, Order } from '../models/OrderModel';
import { handleError } from '../handlers/errorHandler';

const router = express.Router();
const orderModel = new OrderModel();

// GET all orders
router.get('/', async (req, res) => {
  try {
    const orders = await orderModel.getAll();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
});

// GET order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await orderModel.getById(parseInt(req.params.id, 10));
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
});

// CREATE a new order
router.post('/', async (req, res) => {
  try {
    const order: Order = req.body;
    const newOrder = await orderModel.create(order);
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
});

// UPDATE an order by ID
router.put('/:id', async (req, res) => {
  try {
    const order: Order = req.body;
    const updatedOrder = await orderModel.update(parseInt(req.params.id, 10), order);
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
});

// DELETE an order by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedOrder = await orderModel.delete(parseInt(req.params.id, 10));
    res.json(deletedOrder);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
});

export default router;

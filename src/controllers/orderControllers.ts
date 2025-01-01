import { Request, Response } from 'express';
import { OrderModel, Order } from '../models/OrderModel';
import { handleError } from '../handlers/errorHandler';

const orderModel = new OrderModel();

// Show all orders
export const index = async (req: Request, res: Response) => {
  try {
    const orders = await orderModel.getAll();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
};

// Show order detail by ID
export const show = async (req: Request, res: Response) => {
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
};

// Create new order
export const create = async (req: Request, res: Response) => {
  try {
    const order: Order = req.body;
    const newOrder = await orderModel.create(order);
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
};

// Update order by ID
export const update = async (req: Request, res: Response) => {
  try {
    const order: Order = req.body;
    const updatedOrder = await orderModel.update(parseInt(req.params.id, 10), order);
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
};

// Delete order by ID
export const remove = async (req: Request, res: Response) => {
  try {
    const deletedOrder = await orderModel.delete(parseInt(req.params.id, 10));
    res.json(deletedOrder);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
};

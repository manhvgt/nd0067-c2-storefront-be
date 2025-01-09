import { Request, Response } from 'express';
import { OrderProductModel, OrderProduct } from '../models/OrderProductsModel';
import { responseError } from '../handlers/errorHandler';

const orderProductModel = new OrderProductModel();

// Show all order_products
export const index = async (req: Request, res: Response) => {
  try {
    const orderProducts = await orderProductModel.getAll();
    res.json(orderProducts);
  } catch (err) {
    responseError(res, err);
  }
};

// Show a specific order_products by ID
export const show = async (req: Request, res: Response) => {
  try {
    const orderProduct = await orderProductModel.getById(parseInt(req.params.id));
    if (orderProduct) {
      res.json(orderProduct);
    } else {
      res.status(404).json({ message: 'Order Product not found' });
    }
  } catch (err) {
    responseError(res, err);
  }
};

// Show order_products by order_id
export const getByOrderId = async (req: Request, res: Response) => {
  try {
    const orderProducts = await orderProductModel.getByOrderId(parseInt(req.params.orderId));
    if (orderProducts.length > 0) {
      res.json(orderProducts);
    } else {
      res.status(404).json({ message: 'Order Products not found for this order' });
    }
  } catch (err) {
    responseError(res, err);
  }
};

// Create a new order_products
export const create = async (req: Request, res: Response) => {
  try {
    const orderProduct: OrderProduct = req.body;
    const newOrderProduct = await orderProductModel.create(orderProduct);
    res.status(201).json(newOrderProduct);
  } catch (err) {
    responseError(res, err);
  }
};

// Update an order_products by ID
export const update = async (req: Request, res: Response) => {
  try {
    const orderProduct: OrderProduct = req.body;
    const updatedOrderProduct = await orderProductModel.update(parseInt(req.params.id), orderProduct);
    if (updatedOrderProduct) {
      res.json(updatedOrderProduct);
    } else {
      res.status(404).json({ message: 'Order Product not found' });
    }
  } catch (err) {
    responseError(res, err);
  }
};

// Delete an order_products by ID
export const remove = async (req: Request, res: Response) => {
  try {
    const deletedOrderProduct = await orderProductModel.delete(parseInt(req.params.id));
    if (deletedOrderProduct) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Order Product not found' });
    }
  } catch (err) {
    responseError(res, err);
  }
};

import { Request, Response } from 'express';
import { ProductModel, Product } from '../models/ProductModel';
import { handleError } from '../handlers/errorHandler';

const productModel = new ProductModel();

// Show all products
export const index = async (req: Request, res: Response) => {
  try {
    const products = await productModel.getAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
};

// Show product detail by ID
export const show = async (req: Request, res: Response) => {
  try {
    const product = await productModel.getById(parseInt(req.params.id, 10));
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
};

// Create new product
export const create = async (req: Request, res: Response) => {
  try {
    const product: Product = req.body;
    const newProduct = await productModel.create(product);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
};

// Update product by ID
export const update = async (req: Request, res: Response) => {
  try {
    const product: Product = req.body;
    const updatedProduct = await productModel.update(parseInt(req.params.id, 10), product);
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
};

// Delete product by ID
export const remove = async (req: Request, res: Response) => {
  try {
    const deletedProduct = await productModel.delete(parseInt(req.params.id, 10));
    res.json(deletedProduct);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
};

import express from 'express';
import { ProductModel, Product } from '../models/ProductModel';
import { handleError } from '../handlers/errorHandler';

const router = express.Router();
const productModel = new ProductModel();

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await productModel.getAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
});

// GET product by ID
router.get('/:id', async (req, res) => {
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
});

// CREATE a new product
router.post('/', async (req, res) => {
  try {
    const product: Product = req.body;
    const newProduct = await productModel.create(product);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
});

// UPDATE a product by ID
router.put('/:id', async (req, res) => {
  try {
    const product: Product = req.body;
    const updatedProduct = await productModel.update(parseInt(req.params.id, 10), product);
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
});

// DELETE a product by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await productModel.delete(parseInt(req.params.id, 10));
    res.json(deletedProduct);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
});

export default router;

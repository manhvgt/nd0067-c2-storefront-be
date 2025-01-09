import express from 'express';
import { authToken } from '../handlers/authHandler';
import { index, show, create, update, remove } from '../controllers/orderProductsControllers';

const router = express.Router();

// Route to get all order products
router.get('/', authToken, index); // Authentication required

// Route to get a specific order product by ID
router.get('/:id', authToken, show); // Authentication required

// Route to create a new order product
router.post('/', authToken, create); // Authentication required

// Route to update an order product by ID
router.put('/:id', authToken, update); // Authentication required

// Route to delete an order product by ID
router.delete('/:id', authToken, remove); // Authentication required

export default router;

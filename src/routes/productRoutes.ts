import express from 'express';
import { authToken } from '../handlers/authHandler';
import { index, show, create, update, remove } from '../controllers/productControllers';

const router = express.Router();

router.get('/', index); // No authentication required
router.get('/:id', show); // No authentication required
router.post('/', authToken, create); // Authentication required
router.put('/:id', authToken, update); // Authentication required
router.delete('/:id', authToken, remove); // Authentication required

export default router;

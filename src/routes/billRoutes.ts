import express from 'express';
import { authToken } from '../handlers/authHandler';
import { index, show, create, update, remove } from '../controllers/billControllers';

const router = express.Router();

router.get('/', authToken, index);
router.get('/:id', authToken, show);
router.post('/', authToken, create);
router.put('/:id', authToken, update);
router.delete('/:id', authToken, remove);

export default router;

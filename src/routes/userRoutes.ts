import express from 'express';
import { UserModel, User } from '../models/UserModel';
import { handleError } from '../handlers/errorHandler';

const router = express.Router();
const userModel = new UserModel();

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await userModel.getAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await userModel.getById(parseInt(req.params.id, 10));
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
});

// CREATE a new user
router.post('/', async (req, res) => {
  try {
    const user: User = req.body;
    const newUser = await userModel.create(user);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
});

// UPDATE a user by ID
router.put('/:id', async (req, res) => {
  try {
    const user: User = req.body;
    const updatedUser = await userModel.update(parseInt(req.params.id, 10), user);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
});

// DELETE a user by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await userModel.delete(parseInt(req.params.id, 10));
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ error: handleError(err) });
  }
});

export default router;

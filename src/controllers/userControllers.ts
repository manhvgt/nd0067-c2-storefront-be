import { Request, Response } from 'express';
import { UserModel, User } from '../models/UserModel';
import { responseError } from '../handlers/errorHandler';

const userModel = new UserModel();

// Show all users
export const index = async (req: Request, res: Response) => {
  try {
    const users = await userModel.getAll();
    res.json(users);
  } catch (err) {
    responseError(res, err);
  }
};

// Show user detail by ID
export const show = async (req: Request, res: Response) => {
  try {
    const user = await userModel.getById(parseInt(req.params.id, 10));
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    responseError(res, err);
  }
};

// Create new user
export const create = async (req: Request, res: Response) => {
  try {
    const user: User = req.body;
    const token = await userModel.create(user);
    res.status(201).json({ token });
  } catch (err) {
    responseError(res, err);
  }
};

// Update user by ID
export const update = async (req: Request, res: Response) => {
  try {
    const user: User = req.body;
    const updatedUser = await userModel.update(parseInt(req.params.id, 10), user);
    res.json(updatedUser);
  } catch (err) {
    responseError(res, err);
  }
};

// Delete user by ID
export const remove = async (req: Request, res: Response) => {
  try {
    const deletedUser = await userModel.delete(parseInt(req.params.id, 10));
    res.json(deletedUser);
  } catch (err) {
    responseError(res, err);
  }
};

import { Request, Response } from 'express';
import { UserService } from './user.service';
import { successResponse } from '../../shared/utils/response';

const userService = new UserService();

// GET /api/users/me
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  const user = await userService.findById(userId);
  res.status(200).json(successResponse(user));
};

// PUT /api/users/me
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  const updated = await userService.update(userId, req.body);
  res.status(200).json(successResponse(updated, 'Profile updated'));
};

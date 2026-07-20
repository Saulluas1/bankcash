import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { successResponse } from '../../shared/utils/response';

const authService = new AuthService();

export const register = async (req: Request, res: Response): Promise<void> => {
  // TODO: validate body with express-validator
  const { name, email, password } = req.body;
  const result = await authService.register({ name, email, password });
  res.status(201).json(successResponse(result, 'User registered successfully'));
};

export const login = async (req: Request, res: Response): Promise<void> => {
  // TODO: validate body with express-validator
  const { email, password } = req.body;
  const result = await authService.login({ email, password });
  res.status(200).json(successResponse(result, 'Login successful'));
};

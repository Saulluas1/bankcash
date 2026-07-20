import { Router } from 'express';
import { getProfile, updateProfile } from './user.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

// GET /api/users/me
router.get('/me', getProfile);

// PUT /api/users/me
router.put('/me', updateProfile);

export default router;

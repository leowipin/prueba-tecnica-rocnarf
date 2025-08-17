import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { UserRole } from '../models/user.model';
import { asyncHandler } from '../utils/async-handler';

const router = Router();
const userController = new UserController();

router.get(
    '/usernames', 
    authMiddleware([UserRole.ADMIN, UserRole.USER]), 
    asyncHandler(userController.getUsernames)
);

export default router;
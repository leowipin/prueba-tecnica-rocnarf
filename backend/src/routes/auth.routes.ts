import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { RegisterDto } from '../dtos/auth/register.dto';
import { asyncHandler } from '../utils/async-handler';

const router = Router();
const authController = new AuthController();

router.post(
    '/register', 
    validationMiddleware(RegisterDto), 
    asyncHandler(authController.register)
);

export default router;
import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { UserRole } from '../models/user.model';
import { CreateTaskDto } from '../dtos/task/create-task.dto';
import { asyncHandler } from '../utils/async-handler';

const router = Router();
const taskController = new TaskController();

router.post(
    '/',
    authMiddleware([UserRole.ADMIN, UserRole.USER]),
    validationMiddleware(CreateTaskDto),
    asyncHandler(taskController.createTask)
);

export default router;
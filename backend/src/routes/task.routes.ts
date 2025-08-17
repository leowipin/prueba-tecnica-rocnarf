import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { UserRole } from '../models/user.model';
import { CreateTaskDto } from '../dtos/task/create-task.dto';
import { asyncHandler } from '../utils/async-handler';
import { GetTaskParamsDto } from '../dtos/task/get-task-params.dto';
import { GetTasksQueryDto } from '../dtos/task/get-tasks-query.dto';
import { UpdateTaskStatusDto } from '../dtos/task/update-task-status.dto';
import commentRoutes from './comment.routes';

const router = Router();
const taskController = new TaskController();

router.post(
    '/',
    authMiddleware([UserRole.ADMIN, UserRole.USER]),
    validationMiddleware(CreateTaskDto),
    asyncHandler(taskController.createTask)
);

router.get(
    '/',
    authMiddleware([UserRole.ADMIN]),
    validationMiddleware(GetTasksQueryDto, 'query'),
    asyncHandler(taskController.getAllTasks)
);

router.get(
    '/created-by-me',
    authMiddleware([UserRole.USER]),
    validationMiddleware(GetTasksQueryDto, 'query'),
    asyncHandler(taskController.getTasksCreatedBy)
);

router.get(
    '/assigned-to-me',
    authMiddleware([UserRole.USER]),
    validationMiddleware(GetTasksQueryDto, 'query'),
    asyncHandler(taskController.getTasksAssignedTo)
);

router.get(
    '/:taskId',
    authMiddleware([UserRole.ADMIN, UserRole.USER]),
    validationMiddleware(GetTaskParamsDto, 'params'),
    asyncHandler(taskController.getTaskById)
);

router.patch(
    '/:taskId/status',
    authMiddleware([UserRole.USER]),
    validationMiddleware(GetTaskParamsDto, 'params'),
    validationMiddleware(UpdateTaskStatusDto, 'body'),
    asyncHandler(taskController.updateTaskStatus)
);

router.delete(
    '/:taskId',
    authMiddleware([UserRole.ADMIN, UserRole.USER]),
    validationMiddleware(GetTaskParamsDto, 'params'),
    asyncHandler(taskController.deleteTask)
);

// rutas anidadas para comentarios
router.use(
    '/:taskId/comments',
    validationMiddleware(GetTaskParamsDto, 'params'),
    commentRoutes
);


export default router;
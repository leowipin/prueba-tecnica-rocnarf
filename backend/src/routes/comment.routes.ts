import { Router } from 'express';
import { CommentController } from '../controllers/comment.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { UserRole } from '../models/user.model';
import { asyncHandler } from '../utils/async-handler';
import { CreateCommentDto } from '../dtos/comment/create-comment.dto';

const router = Router({ mergeParams: true });
const commentController = new CommentController();

router.post(
    '/',
    authMiddleware([UserRole.USER]),
    validationMiddleware(CreateCommentDto),
    asyncHandler(commentController.createComment)
);

router.get(
    '/',
    authMiddleware([UserRole.ADMIN, UserRole.USER]),
    asyncHandler(commentController.getCommentsForTask)
);

export default router;
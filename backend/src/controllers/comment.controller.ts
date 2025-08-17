import { Request, Response } from 'express';
import { CommentService } from '../services/comment.services';
import { CreateCommentDto } from '../dtos/comment/create-comment.dto';

export class CommentController {
    private commentService: CommentService;

    constructor() {
        this.commentService = new CommentService();
    }

    public createComment = async (req: Request, res: Response): Promise<Response> => {
        const { taskId } = req.params;
        const commentDto: CreateCommentDto = req.body;
        const currentUser = req.user!;

        const newComment = await this.commentService.create(taskId, commentDto, currentUser);

        return res.status(201).json(newComment);
    }

    public getCommentsForTask = async (req: Request, res: Response): Promise<Response> => {
        const { taskId } = req.params;
        const currentUser = req.user!;

        const comments = await this.commentService.findByTaskId(taskId, currentUser);

        return res.status(200).json(comments);
    }
}
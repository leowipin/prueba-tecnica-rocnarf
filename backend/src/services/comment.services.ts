import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Comment } from '../models/comment.model';
import { Task } from '../models/task.model';
import { ForbiddenError, NotFoundError } from '../errors/htpp.errors';
import { CreateCommentDto } from '../dtos/comment/create-comment.dto';
import { AuthenticatedUser } from '../types/authenticated-user';
import { CommentResponseDto } from '../dtos/comment/comment-response.dto';
import { plainToInstance } from 'class-transformer';
import { UserRole } from '../models/user.model';

export class CommentService {
    private commentRepository: Repository<Comment>;
    private taskRepository: Repository<Task>;

    constructor() {
        this.commentRepository = AppDataSource.getRepository(Comment);
        this.taskRepository = AppDataSource.getRepository(Task);
    }

    public async create(taskId: string, commentDto: CreateCommentDto, currentUser: AuthenticatedUser): Promise<CommentResponseDto> {
        const task = await this.taskRepository.findOne({
            where: { id: taskId },
            relations: ['assignedTo']
        });

        if (!task) {
            throw new NotFoundError('La tarea en la que intentas comentar no fue encontrada.');
        }

        if (task.assignedTo.id !== currentUser.id) {
            throw new ForbiddenError('No tienes permiso para comentar en esta tarea. Solo el usuario asignado puede hacerlo.');
        }
        
        const newComment = this.commentRepository.create({
            content: commentDto.content,
            task: { id: taskId },
            user: { id: currentUser.id }
        });

        const savedComment = await this.commentRepository.save(newComment);

        const commentForResponse = await this.commentRepository.findOne({
            where: { id: savedComment.id },
            relations: ['user']
        });
        
        return plainToInstance(CommentResponseDto, commentForResponse, {
            excludeExtraneousValues: true,
        });
    }

    public async findByTaskId(taskId: string, currentUser: AuthenticatedUser): Promise<CommentResponseDto[]> {
        const task = await this.taskRepository.findOne({
            where: { id: taskId },
            relations: ['createdBy', 'assignedTo']
        });

        if (!task) {
            throw new NotFoundError('La tarea no fue encontrada.');
        }

        if (currentUser.role !== UserRole.ADMIN) {
            const isCreator = task.createdBy.id === currentUser.id;
            const isAssignedTo = task.assignedTo.id === currentUser.id;

            if (!isCreator && !isAssignedTo) {
                throw new ForbiddenError('No tienes permiso para ver los comentarios de esta tarea.');
            }
        }

        const comments = await this.commentRepository.find({
            where: {
                task: { id: taskId }
            },
            relations: ['user'],
            order: {
                createdAt: 'ASC'
            }
        });

        return plainToInstance(CommentResponseDto, comments, {
            excludeExtraneousValues: true,
        });
    }
}
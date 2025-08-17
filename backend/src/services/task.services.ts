import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Task, TaskStatus } from '../models/task.model';
import { User, UserRole } from '../models/user.model';
import { CreateTaskDto } from '../dtos/task/create-task.dto';
import { TaskResponseDto } from '../dtos/task/task-response.dto';
import { ForbiddenError, NotFoundError } from '../errors/htpp.errors';
import { plainToInstance } from 'class-transformer';
import { TaskListItemDto } from '../dtos/task/task-list-item.dto';
import { AssignedTaskListItemDto } from '../dtos/task/assigned-task-list-item.dto';
import { GetTasksQueryDto } from '../dtos/task/get-tasks-query.dto';
import { AdminTaskListItemDto } from '../dtos/task/admin-task-list-item.dto';
import { Notification } from '../models/notification.model';
import { AuthenticatedUser } from '../types/authenticated-user';


export class TaskService {
    private taskRepository: Repository<Task>;
    private userRepository: Repository<User>;

    constructor() {
        this.taskRepository = AppDataSource.getRepository(Task);
        this.userRepository = AppDataSource.getRepository(User);
    }

    public async create(taskDto: CreateTaskDto, creator: AuthenticatedUser): Promise<TaskResponseDto> {
        const { title, description, dueDate, assignedToId } = taskDto;

        const assignedToUser = await this.userRepository.findOneBy({ id: assignedToId });
        if (!assignedToUser) {
            throw new NotFoundError(`El usuario con ID ${assignedToId} no fue encontrado.`);
        }

        const newTask = this.taskRepository.create({
            title,
            description,
            dueDate,
            createdBy: { id: creator.id },
            assignedTo: { id: assignedToId }
        });

        const savedTask = await this.taskRepository.save(newTask);
        
        const taskWithRelations = await this.taskRepository.findOne({
            where: { id: savedTask.id },
            relations: ['createdBy', 'assignedTo']
        });
        
        if (!taskWithRelations) {
            throw new Error('No se pudo recuperar la tarea después de crearla.');
        }
        
        return plainToInstance(TaskResponseDto, taskWithRelations, {
            excludeExtraneousValues: true,
        });
    }

    public async findTasksCreatedBy(creatorId: string, filters: GetTasksQueryDto): Promise<TaskListItemDto[]> {
        const queryBuilder = this.taskRepository.createQueryBuilder('task')
            .leftJoinAndSelect('task.assignedTo', 'assignedToUser')
            .where('task.createdById = :creatorId', { creatorId });

        if (filters.status) {
            queryBuilder.andWhere('task.status = :status', { status: filters.status });
        }
        if (filters.dueDate) {
            queryBuilder.andWhere('DATE(task.dueDate) = :dueDate', { dueDate: filters.dueDate });
        }

        const tasks = await queryBuilder
            .orderBy('task.createdAt', 'DESC')
            .getMany();
        
        return plainToInstance(TaskListItemDto, tasks, {
            excludeExtraneousValues: true,
        });
    }

    public async findTasksAssignedTo(assignedToId: string, filters: GetTasksQueryDto): Promise<AssignedTaskListItemDto[]> {
        const queryBuilder = this.taskRepository.createQueryBuilder('task')
            .leftJoinAndSelect('task.createdBy', 'createdByUser')
            .where('task.assignedToId = :assignedToId', { assignedToId });
            
        if (filters.status) {
            queryBuilder.andWhere('task.status = :status', { status: filters.status });
        }
        if (filters.dueDate) {
            queryBuilder.andWhere('DATE(task.dueDate) = :dueDate', { dueDate: filters.dueDate });
        }

        const tasks = await queryBuilder
            .orderBy('task.dueDate', 'ASC')
            .addOrderBy('task.createdAt', 'DESC')
            .getMany();

        return plainToInstance(AssignedTaskListItemDto, tasks, {
            excludeExtraneousValues: true,
        });
    }

    public async findAllAdmin(filters: GetTasksQueryDto): Promise<AdminTaskListItemDto[]> {
        const queryBuilder = this.taskRepository.createQueryBuilder('task')
            .leftJoinAndSelect('task.assignedTo', 'assignedToUser')
            .leftJoinAndSelect('task.createdBy', 'createdByUser');

        if (filters.status) {
            queryBuilder.andWhere('task.status = :status', { status: filters.status });
        }
        if (filters.dueDate) {
            queryBuilder.andWhere('DATE(task.dueDate) = :dueDate', { dueDate: filters.dueDate });
        }

        const tasks = await queryBuilder
            .orderBy('task.createdAt', 'DESC')
            .getMany();
        
        return plainToInstance(AdminTaskListItemDto, tasks, {
            excludeExtraneousValues: true,
        });
    }

    public async findOneById(taskId: string, currentUser: AuthenticatedUser): Promise<TaskResponseDto> {
        const task = await this.taskRepository.findOne({
            where: { id: taskId },
            relations: ['createdBy', 'assignedTo']
        });

        if (!task) {
            throw new NotFoundError('La tarea solicitada no fue encontrada.');
        }

        if (currentUser.role === UserRole.ADMIN) {
        } else {
            const isCreator = task.createdBy.id === currentUser.id;
            const isAssignedTo = task.assignedTo.id === currentUser.id;

            if (!isCreator && !isAssignedTo) {
                throw new ForbiddenError('No tienes permiso para acceder a esta tarea.');
            }
        }
        
        return plainToInstance(TaskResponseDto, task, {
            excludeExtraneousValues: true,
        });
    }

    public async updateStatus(taskId: string, newStatus: TaskStatus, currentUser: AuthenticatedUser): Promise<TaskResponseDto> {
        const updatedTask = await AppDataSource.transaction(async (transactionalEntityManager) => {
            const task = await transactionalEntityManager.findOne(Task, {
                where: { id: taskId },
                relations: ['assignedTo', 'createdBy']
            });

            if (!task) {
                throw new NotFoundError('La tarea no fue encontrada.');
            }

            if (task.assignedTo.id !== currentUser.id) {
                throw new ForbiddenError('No tienes permiso para modificar el estado de esta tarea. Solo el usuario asignado puede hacerlo.');
            }
            
            if (task.status === newStatus) {
                return task;
            }

            task.status = newStatus;
            await transactionalEntityManager.save(Task, task);

            const notificationMessage = `El usuario '${currentUser.username}' ha cambiado el estado de tu tarea '${task.title}' a '${newStatus}'.`;
            
            const newNotification = transactionalEntityManager.create(Notification, {
                message: notificationMessage,
                user: task.createdBy,
                task: task,
                isRead: false
            });

            await transactionalEntityManager.save(Notification, newNotification);

            return task;
        });
        
        return plainToInstance(TaskResponseDto, updatedTask, {
            excludeExtraneousValues: true,
        });
    }

    public async delete(taskId: string, currentUser: AuthenticatedUser): Promise<void> {
        const task = await this.taskRepository.findOne({
            where: { id: taskId },
            relations: ['createdBy']
        });

        if (!task) {
            throw new NotFoundError('La tarea no fue encontrada.');
        }

        // logica de Autorización
        if (currentUser.role !== UserRole.ADMIN && task.createdBy.id !== currentUser.id) {
            throw new ForbiddenError('No tienes permiso para eliminar esta tarea.');
        }

        await this.taskRepository.remove(task);
    }
}
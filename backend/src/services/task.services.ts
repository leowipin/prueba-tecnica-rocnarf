import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Task } from '../models/task.model';
import { User } from '../models/user.model';
import { CreateTaskDto } from '../dtos/task/create-task.dto';
import { TaskResponseDto } from '../dtos/task/task-response.dto';
import { NotFoundError } from '../errors/htpp.errors';
import { plainToInstance } from 'class-transformer';

interface AuthenticatedUser {
    id: string;
    username: string;
    role: string;
}

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
}
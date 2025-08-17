import { Request, Response } from 'express';
import { TaskService } from '../services/task.services';
import { CreateTaskDto } from '../dtos/task/create-task.dto';

export class TaskController {
    private taskService: TaskService;

    constructor() {
        this.taskService = new TaskService();
    }

    public createTask = async (req: Request, res: Response): Promise<Response> => {
        const createTaskDto: CreateTaskDto = req.body;
        
        const creator = req.user!; 

        const newTask = await this.taskService.create(createTaskDto, creator);

        return res.status(201).json(newTask);
    }
}
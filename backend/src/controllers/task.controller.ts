import { Request, Response } from 'express';
import { TaskService } from '../services/task.services';
import { CreateTaskDto } from '../dtos/task/create-task.dto';
import { GetTasksQueryDto } from '../dtos/task/get-tasks-query.dto';
import { UpdateTaskStatusDto } from '../dtos/task/update-task-status.dto';

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

    public getTasksCreatedBy = async (req: Request, res: Response): Promise<Response> => {
        const creatorId = req.user!.id;
        const filters: GetTasksQueryDto = req.query as any;

        const tasks = await this.taskService.findTasksCreatedBy(creatorId, filters);
        
        return res.status(200).json(tasks);
    }

    public getTasksAssignedTo = async (req: Request, res: Response): Promise<Response> => {
        const assignedToId = req.user!.id;
        const filters: GetTasksQueryDto = req.query as any;

        const tasks = await this.taskService.findTasksAssignedTo(assignedToId, filters);
        
        return res.status(200).json(tasks);
    }

    public getAllTasks = async (req: Request, res: Response): Promise<Response> => {
        const filters: GetTasksQueryDto = req.query as any;
        const tasks = await this.taskService.findAllAdmin(filters);
        return res.status(200).json(tasks);
    }

    public getTaskById = async (req: Request, res: Response): Promise<Response> => {
        const { taskId } = req.params;
        const currentUser = req.user!;

        const task = await this.taskService.findOneById(taskId, currentUser);
        
        return res.status(200).json(task);
    }

    public updateTaskStatus = async (req: Request, res: Response): Promise<Response> => {
        const { taskId } = req.params;
        const { status }: UpdateTaskStatusDto = req.body;
        const currentUser = req.user!;

        const updatedTask = await this.taskService.updateStatus(taskId, status, currentUser);

        return res.status(200).json(updatedTask);
    }

     public deleteTask = async (req: Request, res: Response): Promise<Response> => {
        const { taskId } = req.params;
        const currentUser = req.user!;

        await this.taskService.delete(taskId, currentUser);
        
        return res.status(204).send();
    }
}
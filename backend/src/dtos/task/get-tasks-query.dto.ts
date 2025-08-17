import { IsEnum, IsOptional, IsDateString } from 'class-validator';
import { TaskStatus } from '../../models/task.model';

export class GetTasksQueryDto {
    @IsOptional()
    @IsEnum(TaskStatus, { message: 'El estado debe ser uno de los valores permitidos: pendiente, en progreso, completada.' })
    status?: TaskStatus;

    @IsOptional()
    @IsDateString({}, { message: 'La fecha de vencimiento debe ser una fecha válida en formato YYYY-MM-DD.' })
    dueDate?: string;
}
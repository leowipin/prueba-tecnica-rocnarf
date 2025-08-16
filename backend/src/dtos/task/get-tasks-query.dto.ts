import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { TaskStatus } from '../../models/task.model';

export class GetTasksQueryDto {
    @IsEnum(TaskStatus, { message: 'El estado para filtrar no es válido.' })
    @IsOptional()
    status?: TaskStatus;

    @IsDateString({}, { message: 'La fecha de vencimiento para filtrar debe ser una fecha válida.' })
    @IsOptional()
    dueDate?: string;
}
import { IsString, IsOptional, IsDateString, IsUUID, IsEnum } from 'class-validator';
import { TaskStatus } from '../../models/task.model';

export class UpdateTaskDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(TaskStatus, { message: 'El estado no es válido.' })
    @IsOptional()
    status?: TaskStatus;

    @IsDateString({}, { message: 'La fecha de vencimiento debe ser una fecha válida.' })
    @IsOptional()
    dueDate?: Date;

    @IsUUID('4', { message: 'El ID del usuario asignado debe ser un UUID válido.' })
    @IsOptional()
    assignedToId?: string;
}
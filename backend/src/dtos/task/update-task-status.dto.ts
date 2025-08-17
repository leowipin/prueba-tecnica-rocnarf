import { IsEnum, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../../models/task.model';

export class UpdateTaskStatusDto {
    @IsNotEmpty({ message: 'El estado no puede estar vacío.' })
    @IsEnum(TaskStatus, { message: 'El estado proporcionado no es válido.' })
    status!: TaskStatus;
}
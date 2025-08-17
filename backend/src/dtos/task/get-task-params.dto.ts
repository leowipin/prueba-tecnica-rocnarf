import { IsUUID } from 'class-validator';

export class GetTaskParamsDto {
    @IsUUID('4', { message: 'El ID de la tarea debe ser un UUID válido.' })
    taskId!: string;
}
import { IsString, IsNotEmpty, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty({ message: 'El título no puede estar vacío.' })
    title!: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString({}, { message: 'La fecha de vencimiento debe ser una fecha válida.' })
    @IsOptional()
    dueDate?: Date;

    @IsUUID('4', { message: 'El ID del usuario asignado debe ser un UUID válido.' })
    @IsNotEmpty({ message: 'Debes asignar la tarea a un usuario.' })
    assignedToId!: string;
}
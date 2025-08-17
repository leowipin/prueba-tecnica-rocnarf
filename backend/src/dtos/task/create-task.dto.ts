import { Expose, Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsUUID, IsDate } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty({ message: 'El título no puede estar vacío.' })
    @Expose()
    title!: string;

    @IsString()
    @IsOptional()
    @Expose()
    description?: string;

    @IsDate({ message: 'La fecha de vencimiento debe ser una fecha válida.' })
    @Type(() => Date)
    @IsOptional()
    @Expose()
    dueDate?: Date;

    @IsUUID('4', { message: 'El ID del usuario asignado debe ser un UUID válido.' })
    @IsNotEmpty({ message: 'Debes asignar la tarea a un usuario.' })
    @Expose()
    assignedToId!: string;
}
import { Expose, Type } from 'class-transformer';
import { TaskStatus } from '../../models/task.model';
import { UsernameResponseDto } from '../user/username-response.dto';

export class AdminTaskListItemDto {
    @Expose()
    id!: string;

    @Expose()
    title!: string;

    @Expose()
    status!: TaskStatus;

    @Expose()
    dueDate?: Date;

    @Expose()
    @Type(() => UsernameResponseDto)
    assignedTo!: UsernameResponseDto;

    @Expose()
    @Type(() => UsernameResponseDto)
    createdBy!: UsernameResponseDto;
}
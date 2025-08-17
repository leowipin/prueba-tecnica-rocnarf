import { Expose, Type } from 'class-transformer';
import { TaskStatus } from '../../models/task.model';
import { UserResponseDto } from '../auth/user-response.dto';

export class TaskResponseDto {
    @Expose()
    id!: string;

    @Expose()
    title!: string;

    @Expose()
    description?: string;

    @Expose()
    status!: TaskStatus;

    @Expose()
    dueDate?: Date;

    @Expose()
    createdAt!: Date;

    @Expose()
    updatedAt!: Date;

    @Expose()
    @Type(() => UserResponseDto)
    createdBy!: UserResponseDto;

    @Expose()
    @Type(() => UserResponseDto)
    assignedTo!: UserResponseDto;
}
// class UserInTaskResponseDto {
//     id!: string;
//     username!: string;
// }

// class CommentInTaskResponseDto {
//     id!: string;
//     content!: string;
//     createdAt!: Date;
//     user!: UserInTaskResponseDto;
// }

// export class TaskDetailResponseDto {
//     id!: string;
//     title!: string;
//     description?: string;
//     status!: TaskStatus;
//     dueDate?: Date;
//     attachmentPath?: string;
//     createdAt!: Date;
//     updatedAt!: Date;
//     assignedTo!: UserInTaskResponseDto;
//     createdBy!: UserInTaskResponseDto;
//     comments!: CommentInTaskResponseDto[];
// }

// export class TaskListItemResponseDto {
//     id!: string;
//     title!: string;
//     status!: TaskStatus;
//     dueDate?: Date;
//     assignedTo!: UserInTaskResponseDto;
// }
import { TaskStatus } from "../../models/task.model";

class UserInTaskResponseDto {
    id!: string;
    username!: string;
}

class CommentInTaskResponseDto {
    id!: string;
    content!: string;
    createdAt!: Date;
    user!: UserInTaskResponseDto;
}

export class TaskDetailResponseDto {
    id!: string;
    title!: string;
    description?: string;
    status!: TaskStatus;
    dueDate?: Date;
    attachmentPath?: string;
    createdAt!: Date;
    updatedAt!: Date;
    assignedTo!: UserInTaskResponseDto;
    createdBy!: UserInTaskResponseDto;
    comments!: CommentInTaskResponseDto[];
}

export class TaskListItemResponseDto {
    id!: string;
    title!: string;
    status!: TaskStatus;
    dueDate?: Date;
    assignedTo!: UserInTaskResponseDto;
}
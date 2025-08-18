import { CreateCommentDto, CreateCommentResponse, Task, TaskComment, TaskDetail, TaskStatus } from '../types/tasks';
import { apiClient } from './apiClient';

export const getAssignedTasks = async (): Promise<Task[]> => {
  return apiClient.get<Task[]>('/tasks/assigned-to-me');
};

export const getTaskById = async (taskId: string): Promise<TaskDetail> => {
  return apiClient.get<TaskDetail>(`/tasks/${taskId}`);
};

export const getTaskComments = async (taskId: string): Promise<TaskComment[]> => {
  return apiClient.get<TaskComment[]>(`/tasks/${taskId}/comments`);
};

export const createTaskComment = async (
  taskId: string, 
  commentData: CreateCommentDto
): Promise<CreateCommentResponse> => {
  return apiClient.post<CreateCommentResponse>(`/tasks/${taskId}/comments`, commentData);
};

export const changeTaskStatus = async (
  taskId: string, 
  status: TaskStatus
): Promise<void> => {
  return apiClient.patch<void>(`/tasks/${taskId}/status`, { status });
};

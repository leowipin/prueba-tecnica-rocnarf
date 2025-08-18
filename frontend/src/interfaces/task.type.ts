export interface User {
  id: string;
  username: string;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate: string;
  assignedTo?: User;
  createdBy?: User;
}

export interface TaskDetail {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  assignedTo: User;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: User;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  dueDate?: string;
  assignedToId?: string;
}

export interface CreateTaskResponse {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  assignedTo: User;
}

export type TaskStatus = "pendiente" | "en progreso" | "completada";

export const TASK_STATUS = {
  PENDIENTE: "pendiente" as const,
  EN_PROGRESO: "en progreso" as const,
  COMPLETADA: "completada" as const
};

export interface TaskFilters {
  status?: TaskStatus | 'todos';
  dueDate?: string | 'cualquier-fecha';
}

export interface TaskListProps {
  endpoint: string;
  showCreatedBy?: boolean;
  showAssignedTo?: boolean;
}

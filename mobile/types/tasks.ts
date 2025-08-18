export enum TaskStatus {
  PENDIENTE = "pendiente",
  EN_PROGRESO = "en progreso", 
  COMPLETADA = "completada",
}

export interface Task {
  id: string;
  title: string;
  status: string;
  dueDate: string;
  createdBy: {
    id: string;
    username: string;
  };
}

export interface TaskDetail {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  createdBy: object;
  assignedTo: object;
}

export interface TaskComment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
  };
}

export interface CreateCommentDto {
  content: string;
}

export interface CreateCommentResponse {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
  };
}

export interface ChangeTaskStatusDto {
  status: TaskStatus;
}

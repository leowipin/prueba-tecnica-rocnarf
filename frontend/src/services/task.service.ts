import apiClient from './apiClient.service';
import type { Task, TaskFilters, TaskDetail, Comment, CreateTaskRequest, CreateTaskResponse } from '../interfaces/task.type';

export class TaskService {
  // Obtener tareas creadas por el usuario actual
  static async getCreatedByMe(filters?: TaskFilters): Promise<Task[]> {
    const params = new URLSearchParams();
    
    if (filters?.status && filters.status !== 'todos') {
      params.append('status', filters.status);
    }
    
    if (filters?.dueDate && filters.dueDate !== 'cualquier-fecha') {
      // Convertir fecha local a UTC para enviar al servidor
      const localDate = new Date(filters.dueDate + 'T00:00:00');
      const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
      params.append('dueDate', utcDate.toISOString().split('T')[0]);
    }

    const queryString = params.toString();
    const url = queryString ? `/tasks/created-by-me?${queryString}` : '/tasks/created-by-me';
    
    const response = await apiClient.get<Task[]>(url);
    return response.data;
  }

  // Obtener tareas asignadas al usuario actual
  static async getAssignedToMe(filters?: TaskFilters): Promise<Task[]> {
    const params = new URLSearchParams();
    
    if (filters?.status && filters.status !== 'todos') {
      params.append('status', filters.status);
    }
    
    if (filters?.dueDate && filters.dueDate !== 'cualquier-fecha') {
      // Convertir fecha local a UTC para enviar al servidor
      const localDate = new Date(filters.dueDate + 'T00:00:00');
      const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
      params.append('dueDate', utcDate.toISOString().split('T')[0]);
    }

    const queryString = params.toString();
    const url = queryString ? `/tasks/assigned-to-me?${queryString}` : '/tasks/assigned-to-me';
    
    const response = await apiClient.get<Task[]>(url);
    return response.data;
  }

  // Obtener todas las tareas (solo admin)
  static async getAllTasks(filters?: TaskFilters): Promise<Task[]> {
    const params = new URLSearchParams();
    
    if (filters?.status && filters.status !== 'todos') {
      params.append('status', filters.status);
    }
    
    if (filters?.dueDate && filters.dueDate !== 'cualquier-fecha') {
      // Convertir fecha local a UTC para enviar al servidor
      const localDate = new Date(filters.dueDate + 'T00:00:00');
      const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
      params.append('dueDate', utcDate.toISOString().split('T')[0]);
    }

    const queryString = params.toString();
    const url = queryString ? `/tasks?${queryString}` : '/tasks';
    
    const response = await apiClient.get<Task[]>(url);
    return response.data;
  }

  // Obtener detalle de una tarea específica
  static async getTaskDetail(taskId: string): Promise<TaskDetail> {
    const response = await apiClient.get<TaskDetail>(`/tasks/${taskId}`);
    return response.data;
  }

  // Obtener comentarios de una tarea
  static async getTaskComments(taskId: string): Promise<Comment[]> {
    const response = await apiClient.get<Comment[]>(`/tasks/${taskId}/comments`);
    return response.data;
  }

  // Eliminar una tarea
  static async deleteTask(taskId: string): Promise<void> {
    await apiClient.delete(`/tasks/${taskId}`);
  }

  // Crear una nueva tarea
  static async createTask(taskData: CreateTaskRequest): Promise<CreateTaskResponse> {
    // Preparar los datos para enviar
    const requestData: any = {
      title: taskData.title
    };

    // Solo agregar campos opcionales si tienen valor
    if (taskData.description && taskData.description.trim()) {
      requestData.description = taskData.description;
    }

    if (taskData.dueDate) {
      // Convertir fecha local a UTC para enviar al servidor
      const localDate = new Date(taskData.dueDate + 'T00:00:00');
      const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
      requestData.dueDate = utcDate.toISOString();
    }

    if (taskData.assignedToId) {
      requestData.assignedToId = taskData.assignedToId;
    }

    const response = await apiClient.post<CreateTaskResponse>('/tasks', requestData);
    return response.data;
  }
}

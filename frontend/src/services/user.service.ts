import apiClient from './apiClient.service';
import type { User } from '../interfaces/task.type';

export class UserService {
  // Obtener todos los usuarios con rol "user" para asignar tareas
  static async getUsernames(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/users/usernames');
    return response.data;
  }
}

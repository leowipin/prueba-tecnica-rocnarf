import { AuthResponse, LoginDto, RegisterDto } from '../types/auth';
import { apiClient } from './apiClient';

export const login = async (credentials: LoginDto): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
};

export const register = async (userData: RegisterDto): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse>('/auth/register', userData);
};

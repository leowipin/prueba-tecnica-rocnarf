import axios from 'axios';
import { ApiError } from '../errors/apiError';
import type { ErrorResponseDto } from '../interfaces/errorResponse.type';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 15000,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let title: string;
    let description: string;
    let status: number;

    if (axios.isAxiosError(error) && error.response) {
      const backendError = error.response.data as ErrorResponseDto;
      
      status = error.response.status;
      title = backendError.title || 'Error del Servidor';
      description = backendError.description || 'El servidor respondió con un error inesperado.';

    } else {
      status = 503;
      title = 'Error de Conexión';
      description = 'No se pudo conectar con el servidor. Revisa tu conexión a internet.';
    }

    throw new ApiError(title, description, status);
  }
);

export default apiClient;
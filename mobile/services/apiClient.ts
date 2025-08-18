import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { ApiError } from '../types/errors';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = API_BASE_URL) {
    
    this.client = axios.create({
      baseURL,
      timeout: 10000, // 10 segundos de timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para requests - agregar token automáticamente
    this.client.interceptors.request.use(
      async (config) => {
        // Obtener token del secure storage
        try {
          const token = await SecureStore.getItemAsync('auth_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Token added to request');
          }
        } catch (error) {
          console.warn('Error getting token for request:', error);
        }

        console.log(`${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        console.log('Request data:', config.data);
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Interceptor para responses
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
        console.log('Response data:', response.data);
        return response;
      },
      (error: AxiosError) => {
        console.error('Response error:', {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
        return Promise.reject(error);
      }
    );
  }

  async request<T>(endpoint: string, options: any = {}): Promise<T> {
    try {
      const response = await this.client.request({
        url: endpoint,
        ...options,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // El servidor respondió con un código de error
          throw new ApiError(
            error.response.data?.description || `Error ${error.response.status}`,
            error.response.status,
            error.response.statusText || 'Error'
          );
        } else if (error.request) {
          // La petición fue hecha pero no se recibió respuesta
          console.error('No response received:', error.request);
          throw new ApiError(
            'No se pudo conectar con el servidor',
            0,
            'Connection Error'
          );
        } else {
          // Error en la configuración de la petición
          throw new ApiError(
            'Error configurando la petición: ' + error.message,
            0,
            'Config Error'
          );
        }
      }
      // Error no relacionado con Axios
      throw new ApiError('Error inesperado: ' + (error as Error).message);
    }
  }

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      data,
      headers,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      data,
      headers,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      data,
      headers,
    });
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }

}

export const apiClient = new ApiClient();

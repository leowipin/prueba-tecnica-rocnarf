import apiClient from './apiClient.service';
import type { LoginDto, LoginResponseDto, RegisterDto, UserResponseDto } from '../interfaces/auth.type';

export async function login(dto: LoginDto): Promise<LoginResponseDto> {
    const { data } = await apiClient.post<LoginResponseDto>('/auth/login', dto);
    return data;
}

export async function register(dto: RegisterDto): Promise<UserResponseDto> {
    const { data } = await apiClient.post<UserResponseDto>('/auth/register', dto);
    return data;
}
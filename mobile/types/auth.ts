export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthUser {
  id: string;
  username: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  token: string;
}

export interface JWTPayload {
  id: string;
  role: 'user' | 'admin';
  username: string;
  iat: number;
  exp: number;
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AuthContextType, AuthUser, JWTPayload } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Función para guardar el token de forma segura
  const saveToken = async (token: string) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  };

  // Función para guardar el usuario
  const saveUser = async (user: AuthUser) => {
    try {
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  // Función para obtener el token guardado
  const getStoredToken = async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  // Función para obtener el usuario guardado
//   const getStoredUser = async (): Promise<AuthUser | null> => {
//     try {
//       const userString = await SecureStore.getItemAsync(USER_KEY);
//       return userString ? JSON.parse(userString) : null;
//     } catch (error) {
//       console.error('Error getting user:', error);
//       return null;
//     }
//   };

  // Función para limpiar el almacenamiento
  const clearStorage = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };

  // Función para decodificar y validar token
  const decodeAndValidateToken = (token: string): AuthUser | null => {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Verificar si el token ha expirado
      if (decoded.exp < currentTime) {
        console.log('Token has expired');
        return null;
      }
      
      return {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Función para mostrar el contenido del storage (debug)
  const debugStorage = async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userString = await SecureStore.getItemAsync(USER_KEY);
      console.log(' DEBUG STORAGE:');
      console.log('Token:', token ? 'EXISTS' : 'NOT_FOUND');
      console.log("EL TOKEN: ",token)
      console.log('User:', userString ? JSON.parse(userString) : 'NOT_FOUND');
      if (token) {
        const decoded = jwtDecode<JWTPayload>(token);
        console.log('Decoded Token:', decoded);
        console.log('Token expires at:', new Date(decoded.exp * 1000));
        console.log('Current time:', new Date());
      }
    } catch (error) {
      console.error('Error debugging storage:', error);
    }
  };

  // Función de login
  const login = async (newToken: string) => {
    const decodedUser = decodeAndValidateToken(newToken);
    if (decodedUser) {
      setToken(newToken);
      setUser(decodedUser);
      await saveToken(newToken);
      await saveUser(decodedUser);
      console.log('Login successful:', decodedUser);
    } else {
      throw new Error('Token inválido');
    }
  };

  // Función de logout
  const logout = async () => {
    console.log('Logging out...');
    await debugStorage();
    setToken(null);
    setUser(null);
    await clearStorage();
    console.log('Logout completed');
  };

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        console.log('Checking auth state...');
        await debugStorage(); 
        
        const storedToken = await getStoredToken();
        
        if (storedToken) {
          try {
            const decodedUser = decodeAndValidateToken(storedToken);
            if (decodedUser) {
              // Token válido localmente
              setToken(storedToken);
              setUser(decodedUser);
              console.log('Token valid locally:', decodedUser);
            } else {
              console.log('Token expired locally, clearing storage');
              await clearStorage();
            }
          } catch (error) {
            console.log('Error processing token, clearing storage:', error);
            await clearStorage();
          }
        } else {
          console.log('No stored token found');
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

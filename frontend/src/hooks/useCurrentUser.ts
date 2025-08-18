import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';

interface DecodedToken {
  id: string;
  role: string;
  username: string;
  iat: number;
  exp: number;
}

export const useCurrentUser = () => {
  const { token } = useAuth();
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUser(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  return user;
};

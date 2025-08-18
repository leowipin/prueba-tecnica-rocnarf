import { Redirect } from 'expo-router';
import React, { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return null;
  }
  
  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;

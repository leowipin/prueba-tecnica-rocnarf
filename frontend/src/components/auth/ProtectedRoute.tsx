import { Navigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Cargando...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
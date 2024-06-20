import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AdminRouteProps {
    element: React.ReactElement;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ element }) => {
    const { isAuthenticated, isAdmin } = useAuth();
    return isAuthenticated && isAdmin ? element : <Navigate to="/login" />;
};

export default AdminRoute;

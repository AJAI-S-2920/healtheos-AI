import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from '../common/LoadingScreen';

interface PublicOnlyRouteProps {
  children: React.ReactNode;
}

export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen message="Initializing authentication..." />;
  }

  if (currentUser) {
    const origin = (location.state as any)?.from?.pathname || '/dashboard';
    return <Navigate to={origin} replace />;
  }

  return <>{children}</>;
};

export default PublicOnlyRoute;

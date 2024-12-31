// src/components/auth/ProtectedRoute.tsx
import { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true
}) => {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (requireAuth && !isAuthenticated) {
    // Redirect to login but save the attempted URL
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    // Redirect away from auth pages if already logged in
    return <Navigate to="/dashboard/content" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
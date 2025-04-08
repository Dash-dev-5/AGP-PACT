import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children }: React.PropsWithChildren<{ allowedRoles: string[] }>) => {
  const userString = localStorage.getItem('users');
  const user = userString ? JSON.parse(userString) : null;
  const userRole = user?.role;

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/maintenance/404" replace />;
  }
  return children ?? <Outlet />;
};

export default ProtectedRoute;

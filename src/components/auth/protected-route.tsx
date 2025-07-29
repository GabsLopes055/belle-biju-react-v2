import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const location = useLocation();

  // Mostrar loading enquanto ainda está inicializando
  if (isLoading || !isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#770d7c] border-t-transparent shadow-lg"></div>
        <span className="ml-4 text-[#770d7c] text-lg font-medium">
          Verificando autenticação...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Salvar a localização atual para redirecionar após o login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

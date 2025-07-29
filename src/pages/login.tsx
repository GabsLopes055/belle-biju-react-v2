import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LoginForm } from "../components/auth/login-form";

export const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#770d7c]/30 via-[#138182]/40 to-[#770d7c]/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md border border-gray-200">
        <LoginForm />
      </div>
    </div>
  );
};

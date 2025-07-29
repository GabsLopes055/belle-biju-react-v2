import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LoginCredentials } from "../../types/auth.types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<LoginCredentials>({
    mode: "onChange", // Validação em tempo real
  });

  // Observar os valores dos campos para validação customizada
  const watchedValues = watch();
  const isFormValid =
    isValid && watchedValues?.username && watchedValues?.password;

  const { login, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (data: LoginCredentials) => {
    const result = await login(data);

    if (result.success) {
      // Redirecionar para a página que o usuário tentou acessar ou para o dashboard
      const from = (location.state as any)?.from?.pathname || "/";
      // Forçar navegação para o dashboard se o from for login ou vazio
      const redirectTo = from === "/login" ? "/" : from;
      navigate(redirectTo, { replace: true });
    } else {
      console.error("Erro no login:", result.error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <img
          src="/assets/img/logo.jpeg"
          alt="Belle Biju"
          className="mx-auto w-24 h-24 rounded-full mb-4 object-cover"
          onError={(e) => {
            // Fallback se a imagem não for encontrada
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <h1 className="text-3xl font-bold text-belle-primary-900 mb-2">
          Belle Biju
        </h1>
        <p className="text-belle-secondary-700">
          Faça login para acessar o sistema
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
        <Input
          label="Nome de Usuário"
          type="text"
          placeholder="Digite seu usuário"
          error={errors.username?.message}
          {...register("username", {
            required: "Nome de usuário é obrigatório",
            minLength: {
              value: 3,
              message: "Nome de usuário deve ter pelo menos 3 caracteres",
            },
          })}
        />

        <div className="relative">
          <Input
            label="Senha"
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha"
            error={errors.password?.message}
            {...register("password", {
              required: "Senha é obrigatória",
            })}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-9 text-belle-primary-500 hover:text-belle-primary-700 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-belle-primary-600 focus:ring-belle-primary-500 border-belle-primary-300 rounded"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-belle-primary-800"
          >
            Mantenha-me conectado
          </label>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!isFormValid || isLoading}
          isLoading={isLoading}
        >
          Entrar
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-belle-secondary-600">
          Sistema de Gestão Belle Biju © 2025
        </p>
      </div>
    </div>
  );
};

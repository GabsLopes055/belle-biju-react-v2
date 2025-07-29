import { useState, useEffect, useMemo } from "react";
import { authService } from "../services/auth.service";
import { LoginCredentials, User } from "../types/auth.types";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Memoizar isAuthenticated para evitar re-renderizações
  const isAuthenticated = useMemo(() => {
    return isInitialized && authService.isAuthenticated() && !!user;
  }, [user, isInitialized]);

  // Verificar se estamos em desenvolvimento
  const isDevelopment =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        const token = authService.getToken();
        const savedUser = authService.getUser();

        if (token && savedUser) {
          // Em desenvolvimento, pular validação do token devido ao CORS
          // Em produção, validar o token
          if (isDevelopment) {
            console.log(
              "🔧 Modo desenvolvimento: pulando validação de token devido ao CORS"
            );
            setUser(savedUser);
          } else {
            try {
              await authService.validateToken();
              setUser(savedUser);
            } catch {
              console.warn("Token inválido, fazendo logout");
              authService.logout();
              setUser(null);
            }
          }
        } else {
          // Não há token ou usuário, garantir logout
          authService.logout();
          setUser(null);
        }
      } catch (error: any) {
        console.error("Erro na inicialização da autenticação:", error);

        // Em caso de erro de rede/CORS, não fazer logout automático em desenvolvimento
        if (
          isDevelopment &&
          (error.code === "ERR_NETWORK" || error.message?.includes("CORS"))
        ) {
          console.log(
            "🔧 Erro de rede em desenvolvimento - mantendo estado atual"
          );
          const savedUser = authService.getUser();
          if (savedUser) {
            setUser(savedUser);
          }
        } else {
          authService.logout();
          setUser(null);
          setError(error.message || "Erro na autenticação");
        }
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      initAuth();
    }
  }, [isInitialized, isDevelopment]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);

      // Salvar token
      authService.setToken(response.token);

      // Criar dados do usuário simples (sem decodificar token)
      const userData: User = {
        idUser: "1",
        nome: credentials.username,
        username: credentials.username,
        createdAt: new Date(),
        roles: "USER",
      };

      // Salvar dados do usuário
      authService.setUser(userData);
      setUser(userData);

      return { success: true };
    } catch (error: any) {
      let errorMessage = "Erro ao fazer login";

      // Tratar erros específicos
      if (error.code === "ERR_NETWORK") {
        errorMessage = "Erro de conexão. Verifique sua internet.";
      } else if (error.message?.includes("CORS")) {
        errorMessage = "Erro de configuração do servidor. Tente novamente.";
      } else {
        errorMessage = error.message || errorMessage;
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Limpar dados de autenticação
    authService.logout();
    setUser(null);
    setError(null);

    // Redirecionar para a página de login
    window.location.href = "/login";
  };

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated,
    isInitialized,
    clearError: () => setError(null),
  };
};

import api from "./api";
import { LoginCredentials, User } from "../types/auth.types";
import { mockAPI } from "./mock-api";

// Verificar se estamos em desenvolvimento
const isDevelopment =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const authService = {
  async login(credentials: LoginCredentials) {
    try {
      const response = await api.post("/authentication/login", credentials);
      return response.data;
    } catch (error: any) {
      // Em desenvolvimento, usar mock se houver erro de rede/CORS
      if (
        isDevelopment &&
        (error.code === "ERR_NETWORK" || error.message?.includes("CORS"))
      ) {
        console.warn(
          "🔧 Usando mock API devido ao erro de rede em desenvolvimento"
        );
        return await mockAPI.login(credentials);
      }

      // Tratar outros erros
      if (error.response?.status === 400) {
        throw new Error(
          "Credenciais inválidas. Verifique seu usuário e senha."
        );
      }
      if (error.response?.status === 401) {
        throw new Error("Usuário ou senha incorretos.");
      }
      if (error.response?.status === 500) {
        throw new Error(
          "Erro interno do servidor. Tente novamente mais tarde."
        );
      }

      throw new Error(error.response?.data?.message || "Erro ao fazer login");
    }
  },

  async validateToken() {
    try {
      const response = await api.get("/authentication/validate");
      return response.data;
    } catch (error: any) {
      // Em desenvolvimento, usar mock se houver erro de rede/CORS
      if (
        isDevelopment &&
        (error.code === "ERR_NETWORK" || error.message?.includes("CORS"))
      ) {
        console.warn(
          "🔧 Usando mock de validação devido ao erro de rede em desenvolvimento"
        );
        return await mockAPI.validateToken();
      }

      if (error.response?.status === 401) {
        throw new Error("Token inválido ou expirado");
      }
      throw new Error("Erro ao validar token");
    }
  },

  logout() {
    console.log("🔐 Executando logout...");

    // Limpar todos os dados de autenticação
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    // Limpar qualquer outro dado relacionado à autenticação
    sessionStorage.clear();

    // Limpar cookies relacionados à autenticação (se houver)
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    console.log("✅ Logout concluído - dados de autenticação removidos");
  },

  getToken(): string | null {
    return localStorage.getItem("authToken");
  },

  setToken(token: string) {
    localStorage.setItem("authToken", token);
  },

  getUser(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  setUser(user: User) {
    localStorage.setItem("user", JSON.stringify(user));
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

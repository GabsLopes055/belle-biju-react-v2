import axios from "axios";

// Verificar se estamos em produção (Vercel)
const isProduction = window.location.hostname.includes("vercel.app");

const api = axios.create({
  baseURL: "https://bellebiju-backend-production-5cda.up.railway.app/api",
  timeout: 15000, // Aumentar timeout para 15 segundos
  headers: {
    "Content-Type": "application/json",
    // Adicionar headers para CORS
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  },
  // Configuração para CORS
  withCredentials: false, // Mudar para false para evitar problemas de CORS
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Log para debug em produção
  if (isProduction) {
    console.log("🌐 Requisição para:", config.url);
    console.log("🔑 Token presente:", !!token);
  }

  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => {
    if (isProduction) {
      console.log(
        "✅ Resposta recebida:",
        response.status,
        response.config.url
      );
    }
    return response;
  },
  (error) => {
    // Log do erro para debug
    console.error("❌ Erro na API:", error);

    // Verificar se é erro de rede/CORS
    if (error.code === "ERR_NETWORK" || !error.response) {
      console.warn("⚠️ Erro de rede ou CORS detectado");

      // Em produção, mostrar erro mais específico
      if (isProduction) {
        console.error(
          "🚨 ERRO CORS EM PRODUÇÃO - Backend precisa ser configurado"
        );
        console.error(
          "🔧 Solução: Configure CORS no backend para permitir:",
          window.location.origin
        );
      }

      return Promise.reject({
        ...error,
        message: isProduction
          ? "Erro de configuração do servidor. Entre em contato com o administrador."
          : "Erro de conexão com o servidor. Verifique sua internet.",
        isNetworkError: true,
        isCorsError: true,
      });
    }

    // Tratar erro 401 (não autorizado)
    if (error.response?.status === 401) {
      // Só limpar storage se não for erro de CORS
      if (!error.message?.includes("CORS")) {
        localStorage.clear();
        // Só redirecionar se não estivermos já na página de login
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;

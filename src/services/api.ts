import axios from "axios";

const api = axios.create({
  baseURL: "https://bellebiju-backend-production-5cda.up.railway.app/api",
  timeout: 15000, // Aumentar timeout para 15 segundos
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log do erro para debug
    console.error("Erro na API:", error);

    // Verificar se é erro de rede/CORS
    if (error.code === "ERR_NETWORK" || !error.response) {
      console.warn("Erro de rede ou CORS detectado");
      return Promise.reject({
        ...error,
        message: "Erro de conexão com o servidor. Verifique sua internet.",
        isNetworkError: true,
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

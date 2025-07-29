export const API_BASE_URL =
  "https://bellebiju-backend-production-5cda.up.railway.app/api";

export const TOKEN_EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutos em milliseconds

export const PAYMENT_METHODS = [
  { value: "DINHEIRO", label: "Dinheiro" },
  { value: "PIX", label: "PIX" },
  { value: "DEBITO", label: "Cartão de Débito" },
  { value: "CREDITO", label: "Cartão de Crédito" },
] as const;

export const USER_ROLES = [
  { value: "ADMIN", label: "Administrador" },
  { value: "USER", label: "Usuário" },
] as const;

export const CHART_COLORS = {
  DINHEIRO: "#138182", // Verde-azulado Belle
  PIX: "#770d7c", // Roxo Belle principal
  DEBITO: "#f59e0b", // Dourado elegante
  CREDITO: "#ec4899", // Rosa Belle feminino
} as const;

export const NAVIGATION_ITEMS = [
  {
    name: "Dashboard",
    path: "/",
    icon: "LayoutDashboard",
  },
  {
    name: "Vendas",
    path: "/vendas",
    icon: "ShoppingCart",
  },
  {
    name: "Usuários",
    path: "/usuarios",
    icon: "Users",
  },
  {
    name: "Produtos",
    path: "/produtos",
    icon: "Package",
  },
  {
    name: "Gráficos",
    path: "/graficos",
    icon: "BarChart3",
  },
] as const;

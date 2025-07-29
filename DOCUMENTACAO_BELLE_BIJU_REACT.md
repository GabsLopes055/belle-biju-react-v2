# 📝 Sistema Belle Biju - Versão React

## Visão Geral do Projeto

O **Belle Biju** é um sistema de gestão para uma loja de bijuterias que será desenvolvido em **React** com **TypeScript** e **TailwindCSS**. É um CRUD completo que permite gerenciar vendas, usuários, produtos e visualizar relatórios através de gráficos, seguindo os padrões modernos de desenvolvimento React.

## 🚀 Tecnologias Utilizadas

### Core React Stack

- **React 19.1.0** - Biblioteca JavaScript para construção de interfaces
- **TypeScript 5.6.3** - Superset tipado do JavaScript
- **Vite 7.0.4** - Build tool e servidor de desenvolvimento rápido

### Estilização e UI

- **TailwindCSS 4.1.11** - Framework de CSS utilitário
- **@tailwindcss/vite** - Plugin do Tailwind para Vite
- **Lucide React** - Ícones modernos e consistentes
- **Headless UI** - Componentes acessíveis não estilizados

### Roteamento e Estado

- **React Router DOM 6** - Roteamento SPA
- **Zustand** - Gerenciamento de estado global leve
- **React Hook Form** - Gerenciamento de formulários performático

### Gráficos e Visualização

- **Chart.js 4.4.2** - Biblioteca de gráficos
- **React-Chartjs-2** - Wrapper React para Chart.js
- **Date-fns 3.2.0** - Manipulação de datas

### HTTP e Autenticação

- **Axios** - Cliente HTTP com interceptors
- **JWT Decode** - Decodificação de tokens JWT
- **React Query (TanStack Query)** - Cache e sincronização de dados

### Desenvolvimento

- **ESLint** - Linter para identificação de problemas
- **@typescript-eslint** - Regras específicas do TypeScript
- **Prettier** - Formatação automática de código

### Backend (Mantém o mesmo)

- **URL da API**: `https://bellebiju-backend-production-5cda.up.railway.app/api`
- **Token de expiração**: 30 minutos (1800000ms)

## 🏗️ Estrutura do Projeto React

```
belle-biju-react/
├── src/
│   ├── components/           # Componentes React
│   │   ├── ui/              # Componentes base reutilizáveis
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── table.tsx
│   │   │   └── card.tsx
│   │   ├── layout/          # Componentes de layout
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   └── layout.tsx
│   │   ├── auth/            # Componentes de autenticação
│   │   │   ├── login-form.tsx
│   │   │   └── protected-route.tsx
│   │   ├── dashboard/       # Componentes do dashboard
│   │   │   ├── stats-cards.tsx
│   │   │   └── sales-summary.tsx
│   │   ├── vendas/          # Componentes de vendas
│   │   │   ├── venda-form.tsx
│   │   │   ├── venda-list.tsx
│   │   │   ├── venda-item.tsx
│   │   │   └── venda-modal.tsx
│   │   ├── usuarios/        # Componentes de usuários
│   │   │   ├── usuario-form.tsx
│   │   │   ├── usuario-list.tsx
│   │   │   └── usuario-item.tsx
│   │   ├── produtos/        # Componentes de produtos
│   │   │   ├── produto-form.tsx
│   │   │   ├── produto-list.tsx
│   │   │   └── produto-item.tsx
│   │   └── graficos/        # Componentes de gráficos
│   │       ├── chart-bar.tsx
│   │       ├── chart-doughnut.tsx
│   │       └── date-filter.tsx
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.ts       # Autenticação
│   │   ├── useVendas.ts     # Gerenciamento de vendas
│   │   ├── useUsuarios.ts   # Gerenciamento de usuários
│   │   ├── useProdutos.ts   # Gerenciamento de produtos
│   │   ├── useGraficos.ts   # Dados para gráficos
│   │   └── useLocalStorage.ts # Persistência local
│   ├── services/            # Serviços de API
│   │   ├── api.ts           # Configuração do Axios
│   │   ├── auth.service.ts  # Serviços de autenticação
│   │   ├── vendas.service.ts # Serviços de vendas
│   │   ├── usuarios.service.ts # Serviços de usuários
│   │   └── produtos.service.ts # Serviços de produtos
│   ├── stores/              # Stores Zustand
│   │   ├── auth.store.ts    # Store de autenticação
│   │   ├── vendas.store.ts  # Store de vendas
│   │   └── ui.store.ts      # Store de UI (modals, loading)
│   ├── types/               # Definições de tipos TypeScript
│   │   ├── auth.types.ts    # Tipos de autenticação
│   │   ├── venda.types.ts   # Tipos de vendas
│   │   ├── usuario.types.ts # Tipos de usuários
│   │   ├── produto.types.ts # Tipos de produtos
│   │   └── api.types.ts     # Tipos de API
│   ├── utils/               # Funções utilitárias
│   │   ├── formatters.ts    # Formatação de dados
│   │   ├── validators.ts    # Validações
│   │   └── constants.ts     # Constantes da aplicação
│   ├── pages/               # Páginas da aplicação
│   │   ├── login.tsx        # Página de login
│   │   ├── dashboard.tsx    # Página do dashboard
│   │   ├── vendas.tsx       # Página de vendas
│   │   ├── usuarios.tsx     # Página de usuários
│   │   ├── produtos.tsx     # Página de produtos
│   │   └── graficos.tsx     # Página de gráficos
│   ├── App.tsx              # Componente raiz
│   ├── main.tsx             # Ponto de entrada
│   └── index.css            # Estilos globais
├── public/                  # Arquivos estáticos
│   └── assets/
│       └── img/
│           ├── logo.jpeg
│           ├── bg-login.jpg
│           └── grafico.svg
├── package.json             # Dependências e scripts
├── tsconfig.json            # Configuração do TypeScript
├── vite.config.ts           # Configuração do Vite
├── tailwind.config.js       # Configuração do TailwindCSS
└── eslint.config.js         # Configuração do ESLint
```

## 📋 Interfaces/Tipos TypeScript

### Tipos de Autenticação (`auth.types.ts`)

```typescript
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  idUser: string;
  nome: string;
  username: string;
  createdAt: Date;
  roles: "ADMIN" | "USER";
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  expirationTime: Date | null;
}
```

### Tipos de Vendas (`venda.types.ts`)

```typescript
export interface Venda {
  id: string;
  nomeProduto: string;
  preco: number;
  quantidade: number;
  total: number;
  formaPagamento: "DINHEIRO" | "PIX" | "DEBITO" | "CREDITO";
  createAt: string;
  updateAt: string;
}

export interface VendaFormData {
  nomeProduto: string;
  preco: number;
  quantidade: number;
  total: number;
  formaPagamento: "DINHEIRO" | "PIX" | "DEBITO" | "CREDITO";
}

export interface VendasStats {
  totalVendido: number;
  produtosVendidos: number;
  vendasRealizadas: number;
  taxaConclusao: number;
}
```

### Tipos de Usuários (`usuario.types.ts`)

```typescript
export interface Usuario {
  idUser: string;
  nome: string;
  username: string;
  createdAt: Date;
  roles: "ADMIN" | "USER";
}

export interface UsuarioFormData {
  nome: string;
  username: string;
  password: string;
  roles: "ADMIN" | "USER";
}
```

### Tipos de Produtos (`produto.types.ts`)

```typescript
export interface Produto {
  idProduto: string;
  nomeProduto: string;
  precoProduto: number;
}

export interface ProdutoFormData {
  nomeProduto: string;
  precoProduto: number;
}
```

### Tipos de Gráficos (`graficos.types.ts`)

```typescript
export interface DataRange {
  dataInicio: Date;
  dataFim: Date;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
  }[];
}
```

## 🔐 Sistema de Autenticação

### Hook de Autenticação (`useAuth.ts`)

```typescript
export const useAuth = () => {
  const { user, token, login, logout, isAuthenticated } = useAuthStore();

  const loginUser = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      login(response.user, response.token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logoutUser = () => {
    logout();
    localStorage.clear();
  };

  return {
    user,
    token,
    isAuthenticated,
    loginUser,
    logoutUser,
  };
};
```

### Componente de Rota Protegida

```typescript
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
```

## 📱 Componentes e Páginas

### 1. Página de Login (`pages/login.tsx`)

**Funcionalidades:**

- Formulário com React Hook Form
- Validação em tempo real
- Toggle de visibilidade da senha
- Estados de loading
- Redirecionamento automático

**Campos:**

- Username (obrigatório, conversão para lowercase)
- Password (obrigatório, toggle de visibilidade)
- Checkbox "Mantenha-me conectado"

**Estilização TailwindCSS:**

```typescript
const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginCredentials>();
  const { loginUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/assets/img/logo.jpeg" alt="Belle Biju" className="mx-auto w-24 h-24 rounded-full mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Belle Biju</h1>
        </div>

        {/* Formulário com React Hook Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Campos do formulário */}
        </form>
      </div>
    </div>
  );
};
```

### 2. Dashboard (`pages/dashboard.tsx`)

**Componentes:**

- **StatsCards**: Cards com estatísticas
- **SalesSummary**: Resumo das vendas do dia
- **VendaList**: Lista das vendas recentes

**Estatísticas exibidas:**

- Total vendido (formatado em BRL)
- Produtos vendidos
- Número de vendas
- Data atual

### 3. Módulo de Vendas

#### Listagem de Vendas (`components/vendas/venda-list.tsx`)

```typescript
const VendaList: React.FC = () => {
  const { vendas, isLoading, deleteVenda } = useVendas();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVendas = vendas.filter((venda) => venda.nomeProduto.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <input type="text" placeholder="Pesquisar venda..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pagamento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredVendas.map((venda) => (
              <VendaItem key={venda.id} venda={venda} onDelete={deleteVenda} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

#### Formulário de Venda (`components/vendas/venda-form.tsx`)

```typescript
const VendaForm: React.FC<{ venda?: Venda; onClose: () => void }> = ({ venda, onClose }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<VendaFormData>();
  const { createVenda, updateVenda } = useVendas();

  // Cálculo automático do total
  const preco = watch("preco");
  const quantidade = watch("quantidade");

  useEffect(() => {
    if (preco && quantidade) {
      setValue("total", preco * quantidade);
    }
  }, [preco, quantidade, setValue]);

  return (
    <div className="bg-white rounded-xl p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">{venda ? "Editar Venda" : "Nova Venda"}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Nome do Produto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Produto</label>
          <input {...register("nomeProduto", { required: "Nome é obrigatório", minLength: 3 })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" placeholder="Nome do produto" />
          {errors.nomeProduto && <p className="text-red-500 text-sm mt-1">{errors.nomeProduto.message}</p>}
        </div>

        {/* Preço */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preço</label>
            <input {...register("preco", { required: "Preço é obrigatório", min: 0.01 })} type="number" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade</label>
            <input {...register("quantidade", { required: "Quantidade é obrigatória", min: 1 })} type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
          </div>
        </div>

        {/* Total e Forma de Pagamento */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total</label>
            <input {...register("total", { required: "Total é obrigatório" })} type="number" step="0.01" readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Forma de Pagamento</label>
            <select {...register("formaPagamento", { required: "Forma de pagamento é obrigatória" })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
              <option value="">Selecione...</option>
              <option value="DINHEIRO">Dinheiro</option>
              <option value="PIX">PIX</option>
              <option value="DEBITO">Débito</option>
              <option value="CREDITO">Crédito</option>
            </select>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={!isValid} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg disabled:opacity-50">
            {venda ? "Atualizar" : "Cadastrar"}
          </button>
          <button type="button" onClick={onClose} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
```

### 4. Módulo de Gráficos

#### Componente de Gráfico de Barras (`components/graficos/chart-bar.tsx`)

```typescript
import { Bar } from "react-chartjs-2";

const ChartBar: React.FC<{ data: number[] }> = ({ data }) => {
  const chartData = {
    labels: ["Dinheiro", "PIX", "Débito", "Crédito"],
    datasets: [
      {
        label: "Valor Vendido",
        data,
        backgroundColor: ["#138182", "#770d7c", "#7f5410", "#822b0e"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Vendas por Forma de Pagamento",
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <Bar data={chartData} options={options} />
    </div>
  );
};
```

## 🔧 Custom Hooks

### Hook de Vendas (`hooks/useVendas.ts`)

```typescript
export const useVendas = () => {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVendas = async () => {
    setIsLoading(true);
    try {
      const data = await vendasService.getAll();
      setVendas(data);
    } catch (err) {
      setError("Erro ao carregar vendas");
    } finally {
      setIsLoading(false);
    }
  };

  const createVenda = async (vendaData: VendaFormData) => {
    try {
      const newVenda = await vendasService.create(vendaData);
      setVendas((prev) => [newVenda, ...prev]);
      return { success: true };
    } catch (err) {
      return { success: false, error: "Erro ao criar venda" };
    }
  };

  const updateVenda = async (id: string, vendaData: VendaFormData) => {
    try {
      const updatedVenda = await vendasService.update(id, vendaData);
      setVendas((prev) => prev.map((v) => (v.id === id ? updatedVenda : v)));
      return { success: true };
    } catch (err) {
      return { success: false, error: "Erro ao atualizar venda" };
    }
  };

  const deleteVenda = async (id: string) => {
    try {
      await vendasService.delete(id);
      setVendas((prev) => prev.filter((v) => v.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: "Erro ao deletar venda" };
    }
  };

  useEffect(() => {
    fetchVendas();
  }, []);

  return {
    vendas,
    isLoading,
    error,
    createVenda,
    updateVenda,
    deleteVenda,
    refetch: fetchVendas,
  };
};
```

## 🌐 Serviços de API

### Configuração do Axios (`services/api.ts`)

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: "https://bellebiju-backend-production-5cda.up.railway.app/api",
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
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Serviço de Vendas (`services/vendas.service.ts`)

```typescript
import api from "./api";
import { Venda, VendaFormData } from "../types/venda.types";

export const vendasService = {
  async getAll(): Promise<Venda[]> {
    const response = await api.get("/vendas");
    return response.data;
  },

  async create(data: VendaFormData): Promise<Venda> {
    const response = await api.post("/vendas", data);
    return response.data;
  },

  async update(id: string, data: VendaFormData): Promise<Venda> {
    const response = await api.put(`/vendas/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/vendas/${id}`);
  },

  async getByDateRange(dataInicio: string, dataFim: string): Promise<Venda[]> {
    const response = await api.post(`/vendas/${dataInicio}/${dataFim}`, null);
    return response.data;
  },
};
```

## 🎨 Design System TailwindCSS

### Paleta de Cores

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fef7ec",
          500: "#f59e0b", // amber-500
          600: "#d97706", // amber-600
        },
        success: {
          500: "#10b981", // green-500
          600: "#059669", // green-600
        },
        chart: {
          dinheiro: "#138182",
          pix: "#770d7c",
          debito: "#7f5410",
          credito: "#822b0e",
        },
      },
    },
  },
};
```

### Componentes Base

```typescript
// components/ui/button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({ variant = "primary", size = "md", className = "", children, ...props }) => {
  const baseClasses = "font-medium rounded-lg transition-colors focus:outline-none focus:ring-2";
  const variants = {
    primary: "bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-500",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-500",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};
```

## 🚦 Roteamento

### Configuração de Rotas (`App.tsx`)

```typescript
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/protected-route";
import Layout from "./components/layout/layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="vendas" element={<VendasPage />} />
          <Route path="usuarios" element={<UsuariosPage />} />
          <Route path="produtos" element={<ProdutosPage />} />
          <Route path="graficos" element={<GraficosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

## 📦 Gerenciamento de Estado (Zustand)

### Store de Autenticação (`stores/auth.store.ts`)

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
    }
  )
);
```

## 🛠️ Instalação e Configuração

### 1. Dependências do package.json

```json
{
  "name": "belle-biju-react",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^6.26.0",
    "react-hook-form": "^7.52.0",
    "axios": "^1.7.0",
    "zustand": "^4.5.0",
    "chart.js": "^4.4.2",
    "react-chartjs-2": "^5.2.0",
    "date-fns": "^3.2.0",
    "lucide-react": "^0.400.0",
    "@headlessui/react": "^2.0.0",
    "jwt-decode": "^4.0.0",
    "@tanstack/react-query": "^5.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.14",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "postcss": "^8.4.24",
    "tailwindcss": "^4.1.11",
    "@tailwindcss/vite": "^4.0.0-alpha.15",
    "typescript": "^5.6.3",
    "vite": "^7.0.4"
  }
}
```

### 2. Configuração do Vite (`vite.config.ts`)

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
  },
});
```

### 3. Configuração do TailwindCSS (`tailwind.config.js`)

```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fef7ec",
          500: "#f59e0b",
          600: "#d97706",
        },
        chart: {
          dinheiro: "#138182",
          pix: "#770d7c",
          debito: "#7f5410",
          credito: "#822b0e",
        },
      },
    },
  },
  plugins: [],
};
```

## 🚀 Passos para Implementação

### Fase 1: Setup Inicial

1. **Criar projeto Vite + React + TypeScript**

   ```bash
   npm create vite@latest belle-biju-react -- --template react-ts
   cd belle-biju-react
   npm install
   ```

2. **Instalar dependências**

   ```bash
   npm install react-router-dom react-hook-form axios zustand chart.js react-chartjs-2 date-fns lucide-react @headlessui/react jwt-decode @tanstack/react-query
   npm install -D @tailwindcss/vite tailwindcss@next autoprefixer postcss
   ```

3. **Configurar TailwindCSS**
   - Criar `tailwind.config.js`
   - Atualizar `vite.config.ts`
   - Configurar `src/index.css`

### Fase 2: Estrutura Base

1. **Criar estrutura de pastas**
2. **Configurar roteamento**
3. **Implementar autenticação**
4. **Criar componentes base (Button, Input, Modal, etc.)**

### Fase 3: Funcionalidades Core

1. **Sistema de login**
2. **Dashboard com estatísticas**
3. **CRUD de vendas completo**
4. **Gerenciamento de usuários**

### Fase 4: Funcionalidades Avançadas

1. **Listagem de produtos**
2. **Gráficos interativos**
3. **Filtros e pesquisas**
4. **Responsividade mobile**

### Fase 5: Polimento

1. **Estados de loading**
2. **Tratamento de erros**
3. **Validações completas**
4. **Testes (opcional)**

## 📝 Considerações Importantes

### Migração Angular → React

1. **Services → Custom Hooks + API Services**
2. **Components → Functional Components**
3. **Angular Material → TailwindCSS + Headless UI**
4. **RxJS → React Query + Zustand**
5. **Angular Forms → React Hook Form**
6. **Guards → Protected Routes**

### Vantagens da Stack React

- **Performance**: React 19 com concurrent features
- **Developer Experience**: Vite para desenvolvimento rápido
- **Flexibilidade**: TailwindCSS para estilos customizados
- **Type Safety**: TypeScript em toda aplicação
- **Estado Simples**: Zustand mais leve que Redux
- **Formulários**: React Hook Form performático
- **Bundle Size**: Menor que Angular

Este projeto manterá todas as funcionalidades do sistema original Belle Biju, mas com uma arquitetura moderna React, melhor performance e experiência de desenvolvimento superior.

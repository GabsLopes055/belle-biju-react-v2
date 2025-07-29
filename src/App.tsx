import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoginPage } from "./pages/login";
import { DashboardPage } from "./pages/dashboard";
import { UsuariosPage } from "./pages/usuarios";
import { VendasPage } from "./pages/vendas";
import { ProtectedRoute } from "./components/auth/protected-route";
import { Layout } from "./components/layout/layout";

const queryClient = new QueryClient();

const ProdutosPage: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">
      Módulo de Produtos
    </h1>
    <p className="text-gray-600">Em desenvolvimento...</p>
  </div>
);

// Importar a página de gráficos implementada
import { GraficosPage } from "./pages/graficos";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="usuarios" element={<UsuariosPage />} />
            <Route path="vendas" element={<VendasPage />} />
            <Route path="produtos" element={<ProdutosPage />} />
            <Route path="graficos" element={<GraficosPage />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

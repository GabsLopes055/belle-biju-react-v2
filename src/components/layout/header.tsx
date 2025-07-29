import React, { useState } from "react";
import { Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useUIStore } from "../../stores/ui.store";
import { Button } from "../ui/button";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (confirm("Tem certeza que deseja sair?")) {
      try {
        setIsLoggingOut(true);
        console.log("🚪 Iniciando processo de logout...");

        // Executar logout
        logout();

        // O redirecionamento será feito automaticamente pelo hook useAuth
      } catch (error) {
        console.error("❌ Erro durante o logout:", error);
        setIsLoggingOut(false);
        alert("Erro ao fazer logout. Tente novamente.");
      }
    }
  };

  return (
    <header className="shadow-sm border-b border-[#770d7c]/20 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="ml-4 lg:ml-0">
            <h1 className="text-xl font-semibold text-gray-900">Belle Biju</h1>
            <p className="text-sm text-gray-600">Sistema de Gestão</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Informações do usuário */}
          <div className="hidden sm:flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
              <User size={16} className="text-gray-600" />
              <div className="text-sm">
                <p className="font-medium text-gray-800">{user?.nome}</p>
              </div>
            </div>
          </div>

          {/* Botão de logout */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center space-x-2"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">
              {isLoggingOut ? "Saindo..." : "Sair"}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
};

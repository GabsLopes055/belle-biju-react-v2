import React from "react";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  BarChart3,
} from "lucide-react";
import { useUIStore } from "../../stores/ui.store";
import { NAVIGATION_ITEMS } from "../../utils/constants";

const iconMap = {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  BarChart3,
};

export const Sidebar: React.FC = () => {
  const { isSidebarOpen, setSidebarOpen } = useUIStore();

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Overlay para mobile com backdrop-blur */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998] lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-[9999] w-screen lg:w-64 bg-gradient-to-b from-[#770d7c]/20 via-[#138182]/30 to-[#770d7c]/20 shadow-xl transform transition-transform duration-300 ease-in-out backdrop-blur-md
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header do sidebar com botão de fechar no mobile */}
          <div className="flex items-center justify-between p-4 lg:hidden border-b border-gray-200">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Belle Biju
              </h1>
              <p className="text-sm text-gray-600">Sistema de Gestão</p>
            </div>
            <button
              onClick={closeSidebar}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navegação */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {NAVIGATION_ITEMS.map((item) => {
              const IconComponent = iconMap[item.icon as keyof typeof iconMap];

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gray-100 text-gray-900 border-l-2 border-gray-400 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:shadow-sm"
                    }`
                  }
                >
                  <IconComponent size={20} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Footer do sidebar */}
          {/* <div className="p-4 bg-gradient-to-r from-[#770d7c]/15 via-[#138182]/20 to-[#770d7c]/15 backdrop-blur-sm">
            <div className="text-xs text-gray-500 text-center">
              © 2025 Belle Biju
              <br />
              Sistema de Gestão
            </div>
          </div> */}
        </div>
      </aside>
    </>
  );
};

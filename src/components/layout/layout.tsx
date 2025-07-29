import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen relative">
        {/* Sidebar */}
        <Sidebar />

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          {/* Header */}
          <Header />

          {/* Área de conteúdo */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

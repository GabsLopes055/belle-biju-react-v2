import React from "react";
import { TrendingUp, ShoppingCart, Package, Users } from "lucide-react";
import { Card } from "../ui/card";
import { formatCurrency } from "../../utils/formatters";

interface StatsCardsProps {
  totalVendido?: number;
  vendasRealizadas?: number;
  produtosVendidos?: number;
  usuariosAtivos?: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalVendido = 0,
  vendasRealizadas = 0,
  produtosVendidos = 0,
  usuariosAtivos = 0,
}) => {
  const stats = [
    {
      title: "Total Vendido",
      value: formatCurrency(totalVendido),
      icon: TrendingUp,
      color: "text-gray-700",
      bgColor: "bg-white",
      change: "+12.5%",
    },
    {
      title: "Vendas Realizadas",
      value: vendasRealizadas.toString(),
      icon: ShoppingCart,
      color: "text-gray-700",
      bgColor: "bg-white",
      change: "+8.2%",
    },
    {
      title: "Produtos Vendidos",
      value: produtosVendidos.toString(),
      icon: Package,
      color: "text-gray-700",
      bgColor: "bg-white",
      change: "+5.4%",
    },
    {
      title: "Usuários Ativos",
      value: usuariosAtivos.toString(),
      icon: Users,
      color: "text-gray-700",
      bgColor: "bg-white",
      change: "+2.1%",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => {
        const IconComponent = stat.icon;

        return (
          <Card key={stat.title} className="border border-[#770d7c]/20">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <IconComponent className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <div className="flex items-center">
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                  <span className="ml-2 text-sm font-medium text-green-600">
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

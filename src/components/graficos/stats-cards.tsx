import React from "react";
import { TrendingUp, ShoppingCart, Package, CreditCard } from "lucide-react";
import { Card } from "../ui/card";
import { GraficosStats } from "../../types/graficos.types";

interface StatsCardsProps {
  stats: GraficosStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  // Formatar moeda brasileira
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Formatar número com separadores
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("pt-BR").format(value);
  };

  const cards = [
    {
      title: "Total Vendido",
      value: formatCurrency(stats.totalVendido),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Vendas Realizadas",
      value: formatNumber(stats.vendasRealizadas),
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Produtos Vendidos",
      value: formatNumber(stats.produtosVendidos),
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      title: "Forma Mais Usada",
      value: stats.formaPagamentoMaisUsada,
      icon: CreditCard,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="p-6 border-l-4 border-l-[#770d7c]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
            <div
              className={`p-3 rounded-full ${card.bgColor} ${card.borderColor} border`}
            >
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

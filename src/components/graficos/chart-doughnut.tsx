import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { GraficoPizzaResponse } from "../../types/graficos.types";
import { Card } from "../ui/card";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartDoughnutProps {
  data: GraficoPizzaResponse | null;
  isLoading?: boolean;
  title?: string;
  className?: string;
}

export const ChartDoughnut: React.FC<ChartDoughnutProps> = ({
  data,
  isLoading = false,
  title = "Quantidade de Vendas por Forma de Pagamento",
  className = "",
}) => {
  console.log("🎯 ChartDoughnut renderizado com:", {
    data,
    isLoading,
    title,
    hasData: !!data?.dados,
    dataLength: data?.dados?.length,
    dataDados: data?.dados,
  });

  // Dados para o gráfico
  const chartData = {
    labels: ["Dinheiro", "PIX", "Débito", "Crédito"],
    datasets: [
      {
        data: data?.dados || [0, 0, 0, 0],
        backgroundColor: ["#138182", "#770d7c", "#7f5410", "#822b0e"],
        borderColor: ["#138182", "#770d7c", "#7f5410", "#822b0e"],
        borderWidth: 1,
        hoverBackgroundColor: ["#138182", "#770d7c", "#7f5410", "#822b0e"],
      },
    ],
  };

  console.log("🎯 ChartDoughnut chartData:", chartData);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        display: true,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.parsed;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = total ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} vendas (${percentage}%)`;
          },
        },
      },
    },
    cutout: "60%",
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  const calculateTotal = () => {
    if (!data?.dados) return 0;
    return data.dados.reduce((sum: number, value: number) => sum + value, 0);
  };

  if (isLoading) {
    return (
      <Card title={title} className={className}>
        <div className="flex items-center justify-center h-80">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#770d7c] mx-auto mb-4"></div>
            <p className="text-gray-500">Carregando gráfico...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!data || !data.dados) {
    return (
      <Card title={title} className={className}>
        <div className="flex items-center justify-center h-80">
          <div className="text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className="text-gray-500">Nenhum dado disponível</p>
            <p className="text-sm text-gray-400">
              Selecione um período com vendas para visualizar os dados.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const total = calculateTotal();

  return (
    <Card title={title} className={className}>
      <div className="h-80">
        <Doughnut data={chartData} options={options} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center p-3 rounded-lg bg-[#138182]/10 border border-[#138182]/20">
          <p className="text-sm text-gray-600 font-medium">Dinheiro</p>
          <p className="text-lg font-bold text-[#138182]">
            {data.dados[0] || 0} vendas
          </p>
        </div>
        <div className="text-center p-3 rounded-lg bg-[#770d7c]/10 border border-[#770d7c]/20">
          <p className="text-sm text-gray-600 font-medium">PIX</p>
          <p className="text-lg font-bold text-[#770d7c]">
            {data.dados[1] || 0} vendas
          </p>
        </div>
        <div className="text-center p-3 rounded-lg bg-[#7f5410]/10 border border-[#7f5410]/20">
          <p className="text-sm text-gray-600 font-medium">Débito</p>
          <p className="text-lg font-bold text-[#7f5410]">
            {data.dados[2] || 0} vendas
          </p>
        </div>
        <div className="text-center p-3 rounded-lg bg-[#822b0e]/10 border border-[#822b0e]/20">
          <p className="text-sm text-gray-600 font-medium">Crédito</p>
          <p className="text-lg font-bold text-[#822b0e]">
            {data.dados[3] || 0} vendas
          </p>
        </div>
      </div>
      <div className="text-center pt-4 border-t border-gray-200">
        <div className="inline-block p-4 rounded-lg bg-[#2196f3]/10 border border-[#2196f3]/20">
          <p className="text-sm text-gray-600 font-medium">Total de Vendas</p>
          <p className="text-2xl font-bold text-[#2196f3]">{total} vendas</p>
        </div>
      </div>
    </Card>
  );
};

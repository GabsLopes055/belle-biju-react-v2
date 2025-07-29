import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ScriptableContext,
} from "chart.js";
import {
  GraficoTotalVendasResponse,
  CHART_COLORS,
} from "../../types/graficos.types";
import { Card } from "../ui/card";
import {
  validateChartData,
  formatCurrencyForChart,
} from "../../utils/chart-helpers";

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartBarProps {
  data: GraficoTotalVendasResponse | null;
  isLoading?: boolean;
  title?: string;
  className?: string;
}

export const ChartBar: React.FC<ChartBarProps> = ({
  data,
  isLoading = false,
  title = "Total de Vendas ao Longo do Tempo",
  className = "",
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Preparar dados para o gráfico
  const chartData = React.useMemo(() => {
    if (!data || !validateChartData(data.dados, data.labels)) {
      return {
        labels: [],
        datasets: [],
      };
    }

    // Criar gradiente para as barras
    const createGradient = (ctx: ScriptableContext<"bar">) => {
      const canvas = ctx.chart.canvas;
      const canvasContext = canvas.getContext("2d");
      if (!canvasContext) return CHART_COLORS.primary;

      const gradient = canvasContext.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, CHART_COLORS.primary);
      gradient.addColorStop(1, CHART_COLORS.secondary);
      return gradient;
    };

    return {
      labels: data.labels,
      datasets: [
        {
          label: "Valor das Vendas",
          data: data.dados,
          backgroundColor: (ctx: ScriptableContext<"bar">) => {
            return createGradient(ctx);
          },
          borderColor: CHART_COLORS.primary,
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
          hoverBackgroundColor: `${CHART_COLORS.primary}CC`,
          hoverBorderColor: CHART_COLORS.primary,
          hoverBorderWidth: 3,
        },
      ],
    };
  }, [data]);

  // Configurações do gráfico
  const options = React.useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index" as const,
        intersect: false,
      },
      plugins: {
        legend: {
          display: false, // Ocultar legenda já que há apenas uma série
        },
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
            weight: "bold" as const,
          },
          padding: {
            bottom: 20,
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          borderColor: "#770d7c",
          borderWidth: 1,
          callbacks: {
            label: (context: any) => {
              const value = context.raw || 0;
              return `Vendas: ${formatCurrencyForChart(value)}`;
            },
          },
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: "Período",
            font: {
              size: 12,
              weight: "bold" as const,
            },
          },
          grid: {
            display: false,
          },
          ticks: {
            maxRotation: 45,
            minRotation: 0,
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: "Valor (R$)",
            font: {
              size: 12,
              weight: "bold" as const,
            },
          },
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
          ticks: {
            callback: (value: any) => {
              return formatCurrencyForChart(value);
            },
          },
        },
      },
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
    }),
    [data, title]
  );

  if (isLoading) {
    return (
      <Card title={title} className={`${className} h-96`}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#770d7c] border-t-transparent"></div>
          <span className="ml-3 text-gray-600">Carregando gráfico...</span>
        </div>
      </Card>
    );
  }

  if (!data || !data.dados || data.dados.length === 0) {
    return (
      <Card title={title} className={`${className} h-96`}>
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Sem dados disponíveis</h3>
          <p className="text-sm text-center">
            Não há dados de vendas para o período selecionado.
          </p>
        </div>
      </Card>
    );
  }

  // Calcular estatísticas para exibir
  const total = data.dados.reduce((acc, val) => acc + val, 0);
  const media = data.dados.length > 0 ? total / data.dados.length : 0;
  const maiorVenda = Math.max(...data.dados);
  const menorVenda = Math.min(...data.dados);

  return (
    <Card title={title} className={`${className}`}>
      <div className="space-y-4">
        {/* Gráfico */}
        <div className="h-80">
          <Bar data={chartData} options={options} />
        </div>

        {/* Estatísticas resumidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-lg font-semibold text-[#770d7c]">
              {formatCurrency(total)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Média</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(media)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Maior</p>
            <p className="text-lg font-semibold text-green-600">
              {formatCurrency(maiorVenda)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Menor</p>
            <p className="text-lg font-semibold text-blue-600">
              {formatCurrency(menorVenda)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

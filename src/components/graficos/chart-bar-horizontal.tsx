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
} from "chart.js";
import { GraficoPizzaResponse } from "../../types/graficos.types";
import { Card } from "../ui/card";
import {
  normalizeFormaPagamentoData,
  validateChartData,
  FORMAS_PAGAMENTO_LABELS,
  getFormaPagamentoColors,
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

interface ChartBarHorizontalProps {
  data: GraficoPizzaResponse | null;
  isLoading?: boolean;
  title?: string;
  className?: string;
}

export const ChartBarHorizontal: React.FC<ChartBarHorizontalProps> = ({
  data,
  isLoading = false,
  title = "Vendas por Forma de Pagamento",
  className = "",
}) => {
  const chartData = React.useMemo(() => {
    if (!data || !validateChartData(data.dados, data.labels)) {
      return {
        labels: [],
        datasets: [],
      };
    }

    // Normalizar dados para garantir ordem correta
    const normalizedData = normalizeFormaPagamentoData(data.dados, data.labels);

    // Obter cores para cada forma de pagamento
    const backgroundColor = getFormaPagamentoColors();
    const borderColor = backgroundColor.map((color) => color);

    // Mapear labels para nomes mais amigáveis
    const displayLabels = normalizedData.labels.map(
      (label) =>
        FORMAS_PAGAMENTO_LABELS[
          label as keyof typeof FORMAS_PAGAMENTO_LABELS
        ] || label
    );

    return {
      labels: displayLabels,
      datasets: [
        {
          label: "Valor Vendido",
          data: normalizedData.dados,
          backgroundColor,
          borderColor,
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    };
  }, [data]);

  const options = {
    indexAxis: "y" as const, // Barras horizontais
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Não mostrar legenda pois as cores são auto-explicativas
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.x;
            return `${formatCurrencyForChart(value)}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 12,
          },
          callback: function (value: any) {
            return formatCurrencyForChart(value);
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#374151",
          font: {
            size: 14,
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    elements: {
      bar: {
        borderRadius: 8,
      },
    },
  };

  const calculateTotal = () => {
    if (!data?.dados) return 0;
    return data.dados.reduce((sum, value) => sum + value, 0);
  };

  const calculateStats = () => {
    if (!data?.dados || data.dados.length === 0) {
      return {
        total: 0,
        maior: 0,
        menor: 0,
        media: 0,
      };
    }

    const total = calculateTotal();
    const maior = Math.max(...data.dados);
    const menor = Math.min(...data.dados.filter((v) => v > 0));
    const media = total / data.dados.filter((v) => v > 0).length;

    return { total, maior, menor, media };
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

  if (!data || !validateChartData(data.dados, data.labels)) {
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum dado disponível
            </h3>
            <p className="text-gray-500">
              Selecione um período com vendas para visualizar os dados.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const stats = calculateStats();

  return (
    <Card title={title} className={className}>
      <div className="space-y-6">
        {/* Gráfico */}
        <div className="h-80">
          <Bar data={chartData} options={options} />
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Vendido</p>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrencyForChart(stats.total)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Maior Venda</p>
            <p className="text-lg font-bold text-green-600">
              {formatCurrencyForChart(stats.maior)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Menor Venda</p>
            <p className="text-lg font-bold text-blue-600">
              {formatCurrencyForChart(stats.menor)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Média</p>
            <p className="text-lg font-bold text-purple-600">
              {formatCurrencyForChart(stats.media)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

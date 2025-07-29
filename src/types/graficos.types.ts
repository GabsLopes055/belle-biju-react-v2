// Tipos para o módulo de gráficos baseados na documentação do backend
export interface GraficoPizzaRequest {
  dataInicio: string;
  dataFim: string;
}

export interface GraficoPizzaResponse {
  dados: number[];
  labels: string[];
}

export interface GraficoTotalVendasResponse {
  dados: number[];
  labels: string[];
}

// Tipos para filtros de período
export interface DateRange {
  dataInicio: Date;
  dataFim: Date;
}

export interface PeriodFilter {
  dataInicio?: string;
  dataFim?: string;
  periodo?: PeriodPresetId | "customizado";
}

// Tipos para dados dos gráficos Chart.js
export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string[];
  borderColor?: string[];
  borderWidth?: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

// Tipos específicos para cada tipo de gráfico
export interface PizzaChartData extends ChartData {
  datasets: Array<
    ChartDataset & {
      backgroundColor: string[];
      hoverBackgroundColor?: string[];
    }
  >;
}

export interface BarChartData extends ChartData {
  datasets: Array<
    ChartDataset & {
      backgroundColor: string | string[];
      borderColor?: string | string[];
    }
  >;
}

// Métricas para o dashboard de gráficos
export interface GraficosStats {
  totalVendido: number;
  vendasRealizadas: number;
  produtosVendidos: number;
  formaPagamentoMaisUsada: string;
  periodoSelecionado: string;
  crescimentoComparado?: number; // Percentual comparado ao período anterior
}

// Dados agregados por forma de pagamento
export interface VendasPorFormaPagamento {
  DINHEIRO: number;
  PIX: number;
  DEBITO: number;
  CREDITO: number;
}

// Dados para gráfico temporal (vendas ao longo do tempo)
export interface VendasPorPeriodo {
  periodo: string; // Data formatada
  valor: number;
  quantidade: number;
}

// Configurações dos gráficos
export interface ChartConfig {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend: {
      position: "top" | "bottom" | "left" | "right";
      display: boolean;
    };
    title: {
      display: boolean;
      text: string;
    };
    tooltip?: {
      enabled: boolean;
      callbacks?: any;
    };
  };
  scales?: any;
}

// Cores padrão do projeto para gráficos
export const CHART_COLORS = {
  DINHEIRO: "#22c55e", // green-500
  PIX: "#8b5cf6", // violet-500
  DEBITO: "#f59e0b", // amber-500
  CREDITO: "#ef4444", // red-500
  primary: "#770d7c", // Cor primária do projeto
  secondary: "#138182", // Cor secundária do projeto
} as const;

// Presets de períodos rápidos
export const PERIOD_PRESETS = [
  {
    id: "hoje",
    label: "Hoje",
    days: 0,
  },
  {
    id: "semana",
    label: "Última Semana",
    days: 7,
  },
  {
    id: "mes",
    label: "Último Mês",
    days: 30,
  },
  {
    id: "trimestre",
    label: "Último Trimestre",
    days: 90,
  },
] as const;

export type PeriodPresetId = (typeof PERIOD_PRESETS)[number]["id"];

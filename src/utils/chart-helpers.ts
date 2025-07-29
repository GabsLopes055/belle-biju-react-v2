// Utilitários para padronizar dados dos gráficos
export const FORMAS_PAGAMENTO_ORDER = [
  "DINHEIRO",
  "PIX",
  "DEBITO",
  "CREDITO",
] as const;

export const FORMAS_PAGAMENTO_LABELS = {
  DINHEIRO: "Dinheiro",
  PIX: "PIX",
  DEBITO: "Cartão de Débito",
  CREDITO: "Cartão de Crédito",
} as const;

/**
 * Garante que os dados do gráfico de pizza estejam na ordem correta
 * Ordem padrão: [Dinheiro, PIX, Débito, Crédito]
 */
export const normalizeFormaPagamentoData = (
  dados: number[],
  labels: string[]
) => {
  const normalizedDados: number[] = [];
  const normalizedLabels: string[] = [];

  // Para cada forma de pagamento na ordem padrão
  FORMAS_PAGAMENTO_ORDER.forEach((formaPagamento) => {
    // Encontrar o índice dessa forma nos dados recebidos
    const index = labels.findIndex(
      (label) => label.toUpperCase() === formaPagamento
    );

    if (index !== -1) {
      // Se encontrou, usar o valor correspondente
      normalizedDados.push(dados[index] || 0);
    } else {
      // Se não encontrou, usar 0
      normalizedDados.push(0);
    }

    // Sempre adicionar o label na ordem padrão
    normalizedLabels.push(formaPagamento);
  });

  return {
    dados: normalizedDados,
    labels: normalizedLabels,
  };
};

/**
 * Formatar valores monetários para exibição nos gráficos
 */
export const formatCurrencyForChart = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
};

/**
 * Calcular percentual de cada forma de pagamento
 */
export const calculatePercentages = (dados: number[]): number[] => {
  const total = dados.reduce((acc, valor) => acc + valor, 0);

  if (total === 0) return dados.map(() => 0);

  return dados.map((valor) => Math.round((valor / total) * 100 * 100) / 100); // 2 casas decimais
};

/**
 * Validar se os dados do gráfico estão no formato esperado
 */
export const validateChartData = (
  dados: number[],
  labels: string[]
): boolean => {
  // Verificar se existem dados
  if (!dados || !labels || dados.length === 0 || labels.length === 0) {
    return false;
  }

  // Verificar se os arrays têm o mesmo tamanho
  if (dados.length !== labels.length) {
    console.warn(
      "Chart data: Arrays de dados e labels têm tamanhos diferentes"
    );
    return false;
  }

  // Verificar se todos os valores são números válidos
  const hasInvalidNumbers = dados.some((valor) => isNaN(valor) || valor < 0);
  if (hasInvalidNumbers) {
    console.warn("Chart data: Encontrados valores inválidos nos dados");
    return false;
  }

  return true;
};

/**
 * Gerar cores consistentes para as formas de pagamento
 * Cores conforme a documentação Belle Biju
 */
export const getFormaPagamentoColors = (): string[] => {
  return [
    "#138182", // DINHEIRO - Verde-azulado
    "#770d7c", // PIX - Roxo
    "#7f5410", // DEBITO - Marrom
    "#822b0e", // CREDITO - Vermelho-escuro
  ];
};

/**
 * Truncar labels longas para melhor visualização
 */
export const truncateLabel = (
  label: string,
  maxLength: number = 15
): string => {
  if (label.length <= maxLength) return label;
  return label.substring(0, maxLength - 3) + "...";
};

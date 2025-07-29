import api from "./api";
import {
  GraficoPizzaRequest,
  GraficoPizzaResponse,
  GraficoTotalVendasResponse,
} from "../types/graficos.types";

export const graficosService = {
  /**
   * Gerar gráfico de pizza com dados de vendas por forma de pagamento
   * Endpoint: POST /api/graficos/gerarGraficoPizza
   */
  gerarGraficoPizza: async (
    request: GraficoPizzaRequest
  ): Promise<GraficoPizzaResponse> => {
    console.log("🎯 graficosService.gerarGraficoPizza chamado com:", request);
    try {
      const response = await api.post("/graficos/gerarGraficoPizza", request);
      console.log(
        "🎯 graficosService.gerarGraficoPizza resposta:",
        response.data
      );

      // A API retorna apenas array de dados, assumimos labels fixos
      const dados = response.data.dados || response.data;
      const labels = ["DINHEIRO", "PIX", "DEBITO", "CREDITO"]; // Ordem fixa conforme especificado

      const formattedResponse = {
        dados: dados,
        labels: labels,
      };

      console.log(
        "🎯 graficosService.gerarGraficoPizza resposta formatada:",
        formattedResponse
      );
      return formattedResponse;
    } catch (error) {
      console.error("❌ Erro ao gerar gráfico pizza:", error);
      throw error;
    }
  },

  /**
   * Gerar gráfico de total de vendas por forma de pagamento (barras verticais)
   * Endpoint: POST /api/graficos/gerarGraficoTotalVendas
   */
  gerarGraficoTotalVendas: async (
    request: GraficoPizzaRequest
  ): Promise<GraficoTotalVendasResponse> => {
    console.log(
      "🎯 graficosService.gerarGraficoTotalVendas chamado com:",
      request
    );
    try {
      const response = await api.post(
        "/graficos/gerarGraficoTotalVendas",
        request
      );
      console.log(
        "🎯 graficosService.gerarGraficoTotalVendas resposta:",
        response.data
      );

      // A API retorna apenas array de dados, assumimos labels fixos
      const dados = response.data.dados || response.data;
      const labels = ["DINHEIRO", "PIX", "DEBITO", "CREDITO"]; // Ordem fixa conforme especificado

      const formattedResponse = {
        dados: dados,
        labels: labels,
      };

      console.log(
        "🎯 graficosService.gerarGraficoTotalVendas resposta formatada:",
        formattedResponse
      );
      return formattedResponse;
    } catch (error) {
      console.error("❌ Erro ao gerar gráfico total vendas:", error);
      throw error;
    }
  },

  /**
   * Obter dados agregados para estatísticas do dashboard
   */
  async getGraficosStats(dataInicio: string, dataFim: string) {
    try {
      console.log("🔍 getGraficosStats - Iniciando busca de estatísticas:", {
        dataInicio,
        dataFim,
      });

      const [pizzaData, totalVendasData] = await Promise.all([
        this.gerarGraficoPizza({ dataInicio, dataFim }),
        this.gerarGraficoTotalVendas({ dataInicio, dataFim }),
      ]);

      console.log("🔍 getGraficosStats - Dados recebidos:", {
        pizzaData,
        totalVendasData,
      });

      const pizzaDados = pizzaData?.dados || [];
      const totalVendasDados = totalVendasData?.dados || [];

      const totalVendido =
        totalVendasDados.length > 0
          ? totalVendasDados.reduce((acc, valor) => acc + valor, 0)
          : 0;
      const vendasRealizadas =
        pizzaDados.length > 0
          ? pizzaDados.reduce((acc, valor) => acc + valor, 0)
          : 0;

      console.log("🔍 getGraficosStats - Cálculos:", {
        pizzaDados,
        totalVendasDados,
        totalVendido,
        vendasRealizadas,
      });

      // Determinar forma de pagamento mais usada
      const formasPagamento = ["Dinheiro", "PIX", "Débito", "Crédito"];
      const maxIndex = pizzaDados.indexOf(Math.max(...pizzaDados));
      const formaPagamentoMaisUsada = formasPagamento[maxIndex] || "N/A";

      // Simular produtos vendidos (baseado no total de vendas)
      const produtosVendidos = vendasRealizadas * 2; // Média de 2 produtos por venda

      const stats = {
        totalVendido,
        vendasRealizadas,
        produtosVendidos,
        formaPagamentoMaisUsada,
        periodoSelecionado: `${dataInicio} até ${dataFim}`,
      };

      console.log("🔍 getGraficosStats - Stats finais:", stats);
      return stats;
    } catch (error) {
      console.error("❌ getGraficosStats - Erro:", error);
      throw error;
    }
  },

  /**
   * Processar dados de vendas por forma de pagamento (helper)
   */
  processarVendasPorFormaPagamento(dados: number[], labels: string[]): any {
    const result: any = {
      DINHEIRO: 0,
      PIX: 0,
      DEBITO: 0,
      CREDITO: 0,
    };

    // Verificar se os dados estão disponíveis
    if (!dados || !labels || dados.length === 0 || labels.length === 0) {
      return result;
    }

    labels.forEach((label, index) => {
      const valor = dados[index] || 0;
      const formaPagamento = label.toUpperCase() as keyof any;

      if (formaPagamento in result) {
        result[formaPagamento] = valor;
      }
    });

    return result;
  },

  /**
   * Processar dados de vendas por período (helper)
   */
  processarVendasPorPeriodo(dados: number[], labels: string[]): any[] {
    // Verificar se os dados estão disponíveis
    if (!dados || !labels || dados.length === 0 || labels.length === 0) {
      return [];
    }

    return labels.map((periodo, index) => ({
      periodo,
      valor: dados[index] || 0,
      quantidade: Math.round((dados[index] || 0) / 100), // Estimativa de quantidade
    }));
  },

  /**
   * Validar período de datas
   */
  validarPeriodo(dataInicio: string, dataFim: string): boolean {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    // Verificar se as datas são válidas
    if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
      return false;
    }

    // Data de início deve ser menor ou igual à data de fim
    if (inicio > fim) {
      return false;
    }

    // Validar período máximo (12 meses)
    const diffTime = Math.abs(fim.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 365) {
      return false;
    }

    return true;
  },
};

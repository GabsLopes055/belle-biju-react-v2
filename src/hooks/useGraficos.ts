import { useState, useEffect, useCallback } from "react";
import { graficosService } from "../services/graficos.service";
import {
  GraficoPizzaRequest,
  GraficoPizzaResponse,
  GraficoTotalVendasResponse,
  GraficosStats,
  PeriodFilter,
  PERIOD_PRESETS,
  PeriodPresetId,
} from "../types/graficos.types";

export const useGraficos = () => {
  const [pizzaData, setPizzaData] = useState<GraficoPizzaResponse | null>(null);
  const [totalVendasData, setTotalVendasData] =
    useState<GraficoTotalVendasResponse | null>(null);
  const [stats, setStats] = useState<GraficosStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<PeriodFilter>({
    periodo: "mes", // Padrão último mês
  });

  // Função para gerar período padrão
  const getDefaultPeriod = useCallback(
    (presetId: PeriodPresetId | "customizado" = "mes") => {
      if (presetId === "customizado") return { dataInicio: "", dataFim: "" };

      const preset = PERIOD_PRESETS.find((p) => p.id === presetId);
      if (!preset) return { dataInicio: "", dataFim: "" };

      const hoje = new Date();
      const dataFim = hoje.toISOString().split("T")[0];

      let dataInicio: string;
      if (preset.days === 0) {
        dataInicio = dataFim; // Hoje
      } else {
        const inicioDate = new Date(hoje);
        inicioDate.setDate(hoje.getDate() - preset.days);
        dataInicio = inicioDate.toISOString().split("T")[0];
      }

      return { dataInicio, dataFim };
    },
    []
  );

  // Função para aplicar filtro de período
  const applyFilter = useCallback(
    async (filter: PeriodFilter) => {
      console.log("🎯 applyFilter chamado com:", filter);

      // Evitar múltiplas requisições simultâneas
      if (isLoading) {
        console.log("🎯 applyFilter - Já está carregando, ignorando...");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        let { dataInicio, dataFim } = filter;

        // Se não houver datas específicas, usar o período preset
        if (!dataInicio || !dataFim) {
          const periodo = filter.periodo || "mes";
          const defaultPeriod = getDefaultPeriod(periodo);
          dataInicio = defaultPeriod.dataInicio;
          dataFim = defaultPeriod.dataFim;
        }

        console.log("🎯 applyFilter - Período calculado:", {
          dataInicio,
          dataFim,
        });

        // Validar período
        if (!graficosService.validarPeriodo(dataInicio, dataFim)) {
          throw new Error("Período inválido. Verifique as datas selecionadas.");
        }

        const request: GraficoPizzaRequest = { dataInicio, dataFim };

        console.log("🎯 applyFilter - Chamando APIs...");
        // Buscar dados dos gráficos em paralelo
        const [pizzaResponse, totalVendasResponse, statsResponse] =
          await Promise.all([
            graficosService.gerarGraficoPizza(request),
            graficosService.gerarGraficoTotalVendas(request),
            graficosService.getGraficosStats(dataInicio, dataFim),
          ]);

        console.log("🎯 applyFilter - Respostas recebidas:", {
          pizza: pizzaResponse,
          totalVendas: totalVendasResponse,
          stats: statsResponse,
        });

        console.log("🎯 applyFilter - Definindo dados no estado...");
        console.log("🎯 applyFilter - pizzaResponse:", pizzaResponse);
        console.log(
          "🎯 applyFilter - totalVendasResponse:",
          totalVendasResponse
        );
        console.log("🎯 applyFilter - statsResponse:", statsResponse);

        setPizzaData(pizzaResponse);
        setTotalVendasData(totalVendasResponse);
        setStats(statsResponse);

        console.log("🎯 applyFilter - Dados definidos no estado");

        // Atualizar filtro atual
        setCurrentFilter({
          ...filter,
          dataInicio,
          dataFim,
        });

        console.log("✅ applyFilter - Dados atualizados com sucesso!");
      } catch (err: any) {
        const errorMessage =
          err.message || "Erro ao carregar dados dos gráficos";
        setError(errorMessage);
        console.error("❌ applyFilter - Erro:", err);

        // Limpar dados em caso de erro
        setPizzaData(null);
        setTotalVendasData(null);
        setStats(null);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    },
    [isLoading, getDefaultPeriod]
  );

  // Função para definir período preset
  const setPeriodPreset = useCallback(
    async (presetId: PeriodPresetId) => {
      console.log("🎯 setPeriodPreset chamado com:", presetId);
      const newFilter: PeriodFilter = { periodo: presetId };
      await applyFilter(newFilter);
    },
    [applyFilter]
  );

  // Função para definir período customizado
  const setCustomPeriod = useCallback(
    async (dataInicio: string, dataFim: string) => {
      console.log("🎯 setCustomPeriod chamado com:", { dataInicio, dataFim });
      const newFilter: PeriodFilter = {
        dataInicio,
        dataFim,
        periodo: "customizado",
      };
      await applyFilter(newFilter);
    },
    [applyFilter]
  );

  // Função para recarregar dados
  const refetch = useCallback(() => {
    console.log("🎯 refetch chamado");
    if (currentFilter) {
      applyFilter(currentFilter);
    }
  }, [currentFilter, applyFilter]);

  // Função para limpar erros
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Função para obter resumo formatado do período
  const getPeriodSummary = useCallback(() => {
    if (!currentFilter.dataInicio || !currentFilter.dataFim) {
      const preset = PERIOD_PRESETS.find((p) => p.id === currentFilter.periodo);
      return preset?.label || "Período não definido";
    }

    const inicio = new Date(currentFilter.dataInicio);
    const fim = new Date(currentFilter.dataFim);

    const inicioFormatado = inicio.toLocaleDateString("pt-BR");
    const fimFormatado = fim.toLocaleDateString("pt-BR");

    if (inicioFormatado === fimFormatado) {
      return `Hoje (${inicioFormatado})`;
    }

    return `${inicioFormatado} até ${fimFormatado}`;
  }, [currentFilter]);

  // Efeito para carregar dados iniciais
  useEffect(() => {
    // Carregar dados iniciais apenas uma vez
    if (!isInitialized) {
      console.log("🎯 useEffect - Iniciando carregamento de dados iniciais...");

      const loadInitialData = async () => {
        setIsLoading(true);
        setError(null);

        try {
          // Usar período padrão (último mês)
          const hoje = new Date();
          const umMesAtras = new Date(
            hoje.getTime() - 30 * 24 * 60 * 60 * 1000
          );

          const dataInicio = umMesAtras.toISOString().split("T")[0];
          const dataFim = hoje.toISOString().split("T")[0];

          console.log("🎯 useEffect - Período calculado:", {
            dataInicio,
            dataFim,
          });

          const request = { dataInicio, dataFim };

          // Buscar dados dos gráficos em paralelo
          console.log("🎯 useEffect - Chamando APIs...");
          const [pizzaResponse, totalVendasResponse, statsResponse] =
            await Promise.all([
              graficosService.gerarGraficoPizza(request),
              graficosService.gerarGraficoTotalVendas(request),
              graficosService.getGraficosStats(dataInicio, dataFim),
            ]);

          console.log("🎯 useEffect - Respostas recebidas:", {
            pizza: pizzaResponse,
            totalVendas: totalVendasResponse,
            stats: statsResponse,
          });

          setPizzaData(pizzaResponse);
          setTotalVendasData(totalVendasResponse);
          setStats(statsResponse);

          // Atualizar filtro atual
          setCurrentFilter({
            periodo: "mes",
            dataInicio,
            dataFim,
          });

          console.log("✅ useEffect - Dados carregados com sucesso!");
        } catch (err: any) {
          const errorMessage =
            err.message || "Erro ao carregar dados dos gráficos";
          setError(errorMessage);
          console.error("❌ useEffect - Erro ao carregar dados:", err);
        } finally {
          setIsLoading(false);
          setIsInitialized(true);
          console.log("🎯 useEffect - Finalizado");
        }
      };

      loadInitialData();
    }
  }, [isInitialized]); // Executar apenas uma vez na montagem

  const hasData = !!(
    pizzaData?.dados?.length || totalVendasData?.dados?.length
  );

  // Teste simples para verificar se os dados estão chegando
  console.log("🎯 TESTE hasData:", {
    pizzaData,
    totalVendasData,
    pizzaDataDados: pizzaData?.dados,
    totalVendasDataDados: totalVendasData?.dados,
    pizzaDataLength: pizzaData?.dados?.length,
    totalVendasDataLength: totalVendasData?.dados?.length,
    pizzaDataExists: !!pizzaData,
    totalVendasDataExists: !!totalVendasData,
    finalHasData: hasData,
    // Teste manual
    test1: (pizzaData?.dados?.length || 0) > 0,
    test2: (totalVendasData?.dados?.length || 0) > 0,
    testFinal:
      (pizzaData?.dados?.length || 0) > 0 ||
      (totalVendasData?.dados?.length || 0) > 0,
  });

  console.log("🎯 useGraficos return:", {
    pizzaData,
    totalVendasData,
    hasData,
    isLoading,
    isInitialized,
    currentFilter,
    error,
  });

  console.log("🎯 hasData calculation:", {
    pizzaDataLength: pizzaData?.dados?.length,
    totalVendasDataLength: totalVendasData?.dados?.length,
    pizzaDataExists: !!pizzaData,
    totalVendasDataExists: !!totalVendasData,
    pizzaDataDados: pizzaData?.dados,
    totalVendasDataDados: totalVendasData?.dados,
    finalHasData: hasData,
  });

  return {
    // Dados
    pizzaData,
    totalVendasData,
    stats,

    // Estados
    isLoading,
    error,
    isInitialized,
    currentFilter,

    // Funções
    applyFilter,
    setPeriodPreset,
    setCustomPeriod,
    refetch,
    clearError,
    getPeriodSummary,

    // Helpers
    isDataEmpty: !pizzaData?.dados?.length && !totalVendasData?.dados?.length,
    hasData,
  };
};

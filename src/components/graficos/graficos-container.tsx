import React from "react";
import { BarChart3 } from "lucide-react";
import { DateFilter } from "./date-filter";
import { ChartDoughnut } from "./chart-doughnut";
import { ChartBarVertical } from "./chart-bar-vertical";
import { StatsCards } from "./stats-cards";
import { useGraficos } from "../../hooks/useGraficos";
import { Button } from "../ui/button";

export const GraficosContainer: React.FC = () => {
  const {
    pizzaData,
    totalVendasData,
    stats,
    isLoading,
    error,
    currentFilter,
    applyFilter,
    setPeriodPreset,
    clearError,
    hasData,
  } = useGraficos();

  console.log("🎯 GraficosContainer renderizado:", {
    pizzaData,
    totalVendasData,
    stats,
    isLoading,
    error,
    currentFilter,
    hasData,
    pizzaDataExists: !!pizzaData,
    totalVendasDataExists: !!totalVendasData,
    pizzaDataLength: pizzaData?.dados?.length,
    totalVendasDataLength: totalVendasData?.dados?.length,
    // Forçar renderização
    shouldRenderCharts: !isLoading && (pizzaData || totalVendasData),
  });

  const handleFilter = async (filter: any) => {
    console.log("🎯 GraficosContainer - handleFilter chamado com:", filter);
    await applyFilter(filter);
  };

  const handleClear = async () => {
    console.log("🎯 GraficosContainer - handleClear chamado");
    // Limpar filtros e carregar dados padrão
    await setPeriodPreset("mes");
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-400 mb-6">
            <BarChart3 size={80} className="mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Erro ao carregar dados
          </h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button
            onClick={clearError}
            className="bg-[#770d7c] hover:bg-[#770d7c]/90"
          >
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <DateFilter
        onFilter={handleFilter}
        onClear={handleClear}
        isLoading={isLoading}
        currentFilter={currentFilter}
      />

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#770d7c] mx-auto mb-4"></div>
            <p className="text-gray-500">Carregando dados dos gráficos...</p>
          </div>
        </div>
      )}

      {/* Conteúdo dos Gráficos */}
      {!isLoading && (
        <div className="space-y-6">
          {/* Cards de Estatísticas */}
          {stats && <StatsCards stats={stats} />}

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Pizza */}
            {pizzaData && pizzaData.dados && pizzaData.dados.length > 0 && (
              <ChartDoughnut
                data={pizzaData}
                title="Quantidade de Vendas por Forma de Pagamento"
              />
            )}

            {/* Gráfico de Barras */}
            {totalVendasData &&
              totalVendasData.dados &&
              totalVendasData.dados.length > 0 && (
                <ChartBarVertical
                  data={totalVendasData}
                  title="Valor Vendido por Forma de Pagamento"
                />
              )}
          </div>
        </div>
      )}

      {/* Imagem de fundo quando não há dados */}
      {!isLoading &&
        (!pizzaData || !pizzaData.dados || pizzaData.dados.length === 0) &&
        (!totalVendasData ||
          !totalVendasData.dados ||
          totalVendasData.dados.length === 0) && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-gray-400 mb-6">
                <BarChart3 size={80} className="mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Nenhum dado disponível
              </h3>
              <p className="text-gray-500 mb-4">
                Selecione um período com vendas para visualizar os gráficos.
              </p>
              <div className="flex items-center justify-center space-x-3">
                <Button
                  onClick={() => setPeriodPreset("mes")}
                  className="bg-[#770d7c] hover:bg-[#770d7c]/90"
                >
                  Carregar Último Mês
                </Button>
                <Button
                  onClick={() => setPeriodPreset("semana")}
                  variant="secondary"
                  className="border-[#770d7c] text-[#770d7c] hover:bg-[#770d7c]/10"
                >
                  Última Semana
                </Button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

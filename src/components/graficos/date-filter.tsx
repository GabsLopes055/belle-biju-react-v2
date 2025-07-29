import React, { useState } from "react";
import { Filter, Calendar, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  PeriodFilter,
  PERIOD_PRESETS,
  PeriodPresetId,
} from "../../types/graficos.types";

interface DateFilterProps {
  onFilter: (filter: PeriodFilter) => void;
  onClear: () => void;
  isLoading?: boolean;
  currentFilter?: PeriodFilter;
}

export const DateFilter: React.FC<DateFilterProps> = ({
  onFilter,
  onClear,
  isLoading = false,
  currentFilter,
}) => {
  const [dataInicio, setDataInicio] = useState(currentFilter?.dataInicio || "");
  const [dataFim, setDataFim] = useState(currentFilter?.dataFim || "");
  const [isExpanded, setIsExpanded] = useState(false);

  const setPresetPeriod = (period: PeriodPresetId) => {
    console.log("🎯 DateFilter - setPresetPeriod chamado com:", period);
    const filter: PeriodFilter = { periodo: period };
    console.log("🎯 DateFilter - Chamando onFilter com:", filter);
    onFilter(filter);
  };

  const handleFilter = () => {
    console.log("🎯 DateFilter - handleFilter chamado");
    const filter: PeriodFilter = {
      dataInicio,
      dataFim,
      periodo: "customizado",
    };
    console.log("🎯 DateFilter - Chamando onFilter com:", filter);
    onFilter(filter);
  };

  const handleClear = () => {
    console.log("🎯 DateFilter - handleClear chamado");
    setDataInicio("");
    setDataFim("");
    onClear();
  };

  const hasActiveFilters = dataInicio || dataFim;

  // Definir data padrão (hoje) para facilitar o uso
  const hoje = new Date().toISOString().split("T")[0];
  const umMesAtras = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const getCurrentFilterLabel = () => {
    if (!currentFilter) return "Selecione um período";

    if (currentFilter.periodo && currentFilter.periodo !== "customizado") {
      const preset = PERIOD_PRESETS.find((p) => p.id === currentFilter.periodo);
      return preset?.label || "Período selecionado";
    }

    if (currentFilter.dataInicio && currentFilter.dataFim) {
      const inicio = new Date(currentFilter.dataInicio).toLocaleDateString(
        "pt-BR"
      );
      const fim = new Date(currentFilter.dataFim).toLocaleDateString("pt-BR");
      return `${inicio} até ${fim}`;
    }

    return "Período personalizado";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">
            Filtros de Período
          </h3>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#770d7c] text-white">
              Período
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClear}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <X size={14} />
              <span>Limpar</span>
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1"
          >
            <Filter size={14} />
            <span>{isExpanded ? "Ocultar" : "Mostrar"} Filtros</span>
          </Button>
        </div>
      </div>

      {/* Período Atual */}
      {currentFilter && (
        <div className="mb-4 p-3 bg-[#770d7c]/5 border border-[#770d7c]/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-[#770d7c]" />
            <span className="text-sm font-medium text-gray-700">
              Período atual: {getCurrentFilterLabel()}
            </span>
          </div>
        </div>
      )}

      {isExpanded && (
        <div className="space-y-4">
          {/* Períodos Predefinidos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Períodos Rápidos
            </label>
            <div className="flex flex-wrap gap-2">
              {PERIOD_PRESETS.map((preset) => (
                <Button
                  key={preset.id}
                  variant="secondary"
                  size="sm"
                  onClick={() => setPresetPeriod(preset.id)}
                  disabled={isLoading}
                  className={`text-xs ${
                    currentFilter?.periodo === preset.id
                      ? "bg-[#770d7c] text-white"
                      : ""
                  }`}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Filtro por Período Customizado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Data Início"
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              max={hoje}
            />

            <Input
              label="Data Fim"
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              min={dataInicio || umMesAtras}
              max={hoje}
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            {hasActiveFilters && (
              <Button
                variant="secondary"
                onClick={handleClear}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <X size={16} />
                <span>Limpar Filtros</span>
              </Button>
            )}

            <Button
              onClick={handleFilter}
              disabled={isLoading || (!dataInicio && !dataFim)}
              isLoading={isLoading}
              className="flex items-center space-x-2 bg-[#770d7c] hover:bg-[#770d7c]/90"
            >
              <Filter size={16} />
              <span>Aplicar Filtros</span>
            </Button>
          </div>

          {/* Resumo dos Filtros Ativos */}
          {hasActiveFilters && (
            <div className="bg-[#770d7c]/5 border border-[#770d7c]/20 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Filtros Ativos:
              </h4>
              <div className="flex flex-wrap gap-2">
                {dataInicio && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Calendar size={12} className="mr-1" />A partir de:{" "}
                    {new Date(dataInicio).toLocaleDateString("pt-BR")}
                  </span>
                )}
                {dataFim && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Calendar size={12} className="mr-1" />
                    Até: {new Date(dataFim).toLocaleDateString("pt-BR")}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

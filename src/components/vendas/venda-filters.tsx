import React, { useState } from "react";
import { Filter, Calendar, CreditCard, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";

interface VendaFiltersProps {
  onFilter: (filters: {
    dataInicio?: string;
    dataFim?: string;
    formaPagamento?: string;
  }) => void;
  onClear: () => void;
  isLoading?: boolean;
}

const formasPagamentoOptions = [
  { value: "", label: "Todas as formas" },
  { value: "DINHEIRO", label: "Dinheiro" },
  { value: "PIX", label: "PIX" },
  { value: "DEBITO", label: "Cartão de Débito" },
  { value: "CREDITO", label: "Cartão de Crédito" },
];

export const VendaFilters: React.FC<VendaFiltersProps> = ({
  onFilter,
  onClear,
  isLoading = false,
}) => {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilter = () => {
    const filters: {
      dataInicio?: string;
      dataFim?: string;
      formaPagamento?: string;
    } = {};

    if (dataInicio) filters.dataInicio = dataInicio;
    if (dataFim) filters.dataFim = dataFim;
    if (formaPagamento) filters.formaPagamento = formaPagamento;

    onFilter(filters);
  };

  const handleClear = () => {
    setDataInicio("");
    setDataFim("");
    setFormaPagamento("");
    onClear();
  };

  const hasActiveFilters = dataInicio || dataFim || formaPagamento;

  // Definir data padrão (hoje) para facilitar o uso
  const hoje = new Date().toISOString().split("T")[0];
  const umMesAtras = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const setPresetPeriod = (period: "today" | "week" | "month") => {
    const hoje = new Date();
    let inicio = new Date();

    switch (period) {
      case "today":
        inicio = hoje;
        break;
      case "week":
        inicio = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        inicio = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    setDataInicio(inicio.toISOString().split("T")[0]);
    setDataFim(hoje.toISOString().split("T")[0]);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">
            Filtros de Vendas
          </h3>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#770d7c] text-white">
              {
                [dataInicio && "Período", formaPagamento && "Pagamento"].filter(
                  Boolean
                ).length
              }{" "}
              filtro(s)
            </span>
          )}
        </div>

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

      {isExpanded && (
        <div className="space-y-4">
          {/* Período Predefinido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Períodos Rápidos
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPresetPeriod("today")}
                className="text-xs"
              >
                Hoje
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPresetPeriod("week")}
                className="text-xs"
              >
                Última Semana
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPresetPeriod("month")}
                className="text-xs"
              >
                Último Mês
              </Button>
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

          {/* Filtro por Forma de Pagamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Forma de Pagamento"
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value)}
              options={formasPagamentoOptions}
              placeholder="Selecione uma forma"
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
              disabled={isLoading}
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
                {formaPagamento && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CreditCard size={12} className="mr-1" />
                    {
                      formasPagamentoOptions.find(
                        (f) => f.value === formaPagamento
                      )?.label
                    }
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

import React, { useState } from "react";
import { Calendar, X, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Modal } from "../ui/modal";
import { PeriodFilter } from "../../types/graficos.types";

interface DateFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilter: (filter: PeriodFilter) => void;
  isLoading?: boolean;
}

export const DateFilterModal: React.FC<DateFilterModalProps> = ({
  isOpen,
  onClose,
  onFilter,
  isLoading = false,
}) => {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [errors, setErrors] = useState<{
    dataInicio?: string;
    dataFim?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Limpar erros anteriores
    setErrors({});

    // Validação
    const newErrors: { dataInicio?: string; dataFim?: string } = {};

    if (!dataInicio) {
      newErrors.dataInicio = "Data inicial é obrigatória";
    }

    if (!dataFim) {
      newErrors.dataFim = "Data final é obrigatória";
    }

    if (dataInicio && dataFim) {
      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);

      if (inicio > fim) {
        newErrors.dataFim = "Data final deve ser maior que a data inicial";
      }

      // Validar período máximo (12 meses)
      const diffTime = Math.abs(fim.getTime() - inicio.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 365) {
        newErrors.dataFim = "Período máximo permitido é de 12 meses";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Aplicar filtro
    const filter: PeriodFilter = {
      dataInicio,
      dataFim,
      periodo: "customizado",
    };

    onFilter(filter);
    onClose();
  };

  const handleClose = () => {
    setDataInicio("");
    setDataFim("");
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Pesquisar por Data">
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cabeçalho */}
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-[#770d7c]/10 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-[#770d7c]" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Selecionar Período
            </h2>
            <p className="text-gray-600">
              Escolha o período para visualizar os dados dos gráficos
            </p>
          </div>

          {/* Campo Data Inicial */}
          <div>
            <label
              htmlFor="dataInicio"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Data Inicial
            </label>
            <Input
              id="dataInicio"
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className={errors.dataInicio ? "border-red-500" : ""}
              max={dataFim || undefined}
            />
            {errors.dataInicio && (
              <p className="mt-1 text-sm text-red-600">{errors.dataInicio}</p>
            )}
          </div>

          {/* Campo Data Final */}
          <div>
            <label
              htmlFor="dataFim"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Data Final
            </label>
            <Input
              id="dataFim"
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className={errors.dataFim ? "border-red-500" : ""}
              min={dataInicio || undefined}
              max={new Date().toISOString().split("T")[0]}
            />
            {errors.dataFim && (
              <p className="mt-1 text-sm text-red-600">{errors.dataFim}</p>
            )}
          </div>

          {/* Informações */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Search className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Dicas para melhor análise
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      Selecione períodos de até 12 meses para melhor performance
                    </li>
                    <li>Use períodos específicos para análises detalhadas</li>
                    <li>
                      Evite períodos muito longos que podem sobrecarregar o
                      sistema
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              <X size={16} className="mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !dataInicio || !dataFim}
              className="bg-[#770d7c] hover:bg-[#770d7c]/90"
            >
              <Search size={16} className="mr-2" />
              {isLoading ? "Pesquisando..." : "Pesquisar"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

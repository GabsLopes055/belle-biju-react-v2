import React, { useState } from "react";
import {
  Plus,
  TrendingUp,
  DollarSign,
  Package,
  CreditCard,
} from "lucide-react";
import { useVendas } from "../hooks/useVendas";
import { Venda, VendaFormData } from "../types/venda.types";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { VendaForm } from "../components/vendas/venda-form";
import { VendaTable } from "../components/vendas/venda-table";
import { VendaFilters } from "../components/vendas/venda-filters";
import { useToast } from "../components/ui/toast";

export const VendasPage: React.FC = () => {
  const {
    vendas,
    isLoading,
    error,
    createVenda,
    updateVenda,
    deleteVenda,
    getVendasByDateRange,
    clearError,
  } = useVendas();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVenda, setEditingVenda] = useState<Venda | null>(null);
  const [filteredVendas, setFilteredVendas] = useState<Venda[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const { addToast } = useToast();

  // Usar vendas filtradas se houver filtro, senão usar todas as vendas
  const displayVendas = isFiltered ? filteredVendas : vendas;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleCreateVenda = async (data: VendaFormData) => {
    setIsFormLoading(true);
    try {
      const result = await createVenda(data);
      if (result.success) {
        addToast("success", "Venda criada com sucesso!");
        setIsFormOpen(false);
        // Limpar filtros para mostrar a nova venda
        if (isFiltered) {
          setIsFiltered(false);
          setFilteredVendas([]);
        }
        return { success: true };
      } else {
        addToast("error", result.error || "Erro ao criar venda");
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      addToast("error", error.message || "Erro inesperado");
      return { success: false, error: error.message };
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleUpdateVenda = async (data: VendaFormData) => {
    if (!editingVenda) return { success: false, error: "Venda não encontrada" };

    setIsFormLoading(true);
    try {
      const result = await updateVenda(editingVenda.id, data);
      if (result.success) {
        addToast("success", "Venda atualizada com sucesso!");
        setEditingVenda(null);
        setIsFormOpen(false);
        return { success: true };
      } else {
        addToast("error", result.error || "Erro ao atualizar venda");
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      addToast("error", error.message || "Erro inesperado");
      return { success: false, error: error.message };
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleEditVenda = (venda: Venda) => {
    setEditingVenda(venda);
    setIsFormOpen(true);
  };

  const handleDeleteVenda = async (venda: Venda) => {
    if (
      !confirm(`Tem certeza que deseja excluir a venda "${venda.nomeProduto}"?`)
    ) {
      return;
    }

    try {
      const result = await deleteVenda(venda.id);
      if (result.success) {
        addToast("success", "Venda excluída com sucesso!");
      } else {
        addToast("error", result.error || "Erro ao excluir venda");
      }
    } catch (error: any) {
      addToast("error", error.message || "Erro inesperado");
    }
  };

  const handleFilter = async (filters: {
    dataInicio?: string;
    dataFim?: string;
    formaPagamento?: string;
  }) => {
    try {
      let result = vendas;

      // Filtrar por período se especificado
      if (filters.dataInicio && filters.dataFim) {
        const periodResult = await getVendasByDateRange(
          filters.dataInicio,
          filters.dataFim
        );
        if (periodResult.success && periodResult.data) {
          result = periodResult.data;
        }
      }

      // Filtrar por forma de pagamento se especificado
      if (filters.formaPagamento) {
        result = result.filter(
          (venda) => venda.formaPagamento === filters.formaPagamento
        );
      }

      setFilteredVendas(result);
      setIsFiltered(true);
      addToast(
        "success",
        `${result.length} venda(s) encontrada(s) com os filtros aplicados`
      );
    } catch (error: any) {
      addToast("error", error.message || "Erro ao aplicar filtros");
    }
  };

  const handleClearFilters = () => {
    setFilteredVendas([]);
    setIsFiltered(false);
    addToast("success", "Filtros removidos");
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingVenda(null);
  };

  // Calcular estatísticas dos dados exibidos
  const displayStats = {
    totalVendido: displayVendas.reduce((acc, venda) => acc + venda.total, 0),
    vendasRealizadas: displayVendas.length,
    produtosVendidos: displayVendas.reduce(
      (acc, venda) => acc + venda.quantidade,
      0
    ),
    ticketMedio:
      displayVendas.length > 0
        ? displayVendas.reduce((acc, venda) => acc + venda.total, 0) /
          displayVendas.length
        : 0,
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <TrendingUp size={48} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Erro ao carregar vendas
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
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendas</h1>
          <p className="text-gray-600 mt-1">
            Gerencie todas as vendas da sua loja de bijuterias
            {isFiltered &&
              ` (${displayVendas.length} resultado(s) filtrado(s))`}
          </p>
        </div>

        <Button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center space-x-2 bg-[#770d7c] hover:bg-[#770d7c]/90"
        >
          <Plus size={20} />
          <span>Nova Venda</span>
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Total Vendido" className="border-l-4 border-l-green-500">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(displayStats.totalVendido)}
              </p>
              <p className="text-sm text-gray-600">
                {isFiltered ? "Filtrado" : "Total geral"}
              </p>
            </div>
          </div>
        </Card>

        <Card
          title="Vendas Realizadas"
          className="border-l-4 border-l-blue-500"
        >
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {displayStats.vendasRealizadas}
              </p>
              <p className="text-sm text-gray-600">Transações</p>
            </div>
          </div>
        </Card>

        <Card
          title="Produtos Vendidos"
          className="border-l-4 border-l-purple-500"
        >
          <div className="flex items-center">
            <Package className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {displayStats.produtosVendidos}
              </p>
              <p className="text-sm text-gray-600">Unidades</p>
            </div>
          </div>
        </Card>

        <Card title="Ticket Médio" className="border-l-4 border-l-orange-500">
          <div className="flex items-center">
            <CreditCard className="h-8 w-8 text-orange-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(displayStats.ticketMedio)}
              </p>
              <p className="text-sm text-gray-600">Por venda</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <VendaFilters
        onFilter={handleFilter}
        onClear={handleClearFilters}
        isLoading={isLoading}
      />

      {/* Tabela de Vendas */}
      <VendaTable
        vendas={displayVendas}
        onEdit={handleEditVenda}
        onDelete={handleDeleteVenda}
        isLoading={isLoading}
      />

      {/* Modal de Formulário */}
      <VendaForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingVenda ? handleUpdateVenda : handleCreateVenda}
        venda={editingVenda}
        isLoading={isFormLoading}
      />
    </div>
  );
};

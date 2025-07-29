import { useState, useEffect, useCallback, useRef } from "react";
import { vendasService } from "../services/vendas.service";
import { Venda, VendaFormData, VendasStats } from "../types/venda.types";

export const useVendas = () => {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [stats, setStats] = useState<VendasStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Ref para controlar se já foi inicializado
  const hasInitialized = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchVendas = useCallback(async () => {
    // Evitar múltiplas requisições simultâneas
    if (isLoading) return;

    // Cancelar requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Criar novo AbortController
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const data = await vendasService.getAll();

      // Garantir que data seja um array
      const vendasArray = Array.isArray(data) ? data : [];
      setVendas(vendasArray);

      // Calcular stats diretamente dos dados recebidos
      if (vendasArray.length > 0) {
        const total = vendasArray.reduce((acc, venda) => acc + venda.total, 0);
        const produtos = vendasArray.reduce(
          (acc, venda) => acc + venda.quantidade,
          0
        );
        const taxaConclusao = 100; // Taxa de conclusão sempre 100% para vendas existentes

        setStats({
          totalVendido: total,
          produtosVendidos: produtos,
          vendasRealizadas: vendasArray.length,
          taxaConclusao,
        });
      } else {
        setStats({
          totalVendido: 0,
          produtosVendidos: 0,
          vendasRealizadas: 0,
          taxaConclusao: 0,
        });
      }
    } catch (err: any) {
      // Ignorar erros de cancelamento
      if (err.name === "AbortError") {
        return;
      }

      const errorMessage =
        err.response?.data?.message || "Erro ao carregar vendas";
      setError(errorMessage);
      setVendas([]); // Garantir que seja um array vazio em caso de erro
      setStats({
        totalVendido: 0,
        produtosVendidos: 0,
        vendasRealizadas: 0,
        taxaConclusao: 0,
      });
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
      abortControllerRef.current = null;
    }
  }, [isLoading]);

  const updateStats = useCallback((vendasArray: Venda[]) => {
    if (vendasArray.length > 0) {
      const total = vendasArray.reduce((acc, venda) => acc + venda.total, 0);
      const produtos = vendasArray.reduce(
        (acc, venda) => acc + venda.quantidade,
        0
      );
      const taxaConclusao = 100; // Taxa de conclusão sempre 100% para vendas existentes

      setStats({
        totalVendido: total,
        produtosVendidos: produtos,
        vendasRealizadas: vendasArray.length,
        taxaConclusao,
      });
    } else {
      setStats({
        totalVendido: 0,
        produtosVendidos: 0,
        vendasRealizadas: 0,
        taxaConclusao: 0,
      });
    }
  }, []);

  const createVenda = async (vendaData: VendaFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const newVenda = await vendasService.create(vendaData);
      const updatedVendas = [newVenda, ...vendas];
      setVendas(updatedVendas);
      updateStats(updatedVendas);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erro ao criar venda";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const updateVenda = async (id: string, vendaData: VendaFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedVenda = await vendasService.update(id, vendaData);
      const updatedVendas = vendas.map((v) => (v.id === id ? updatedVenda : v));
      setVendas(updatedVendas);
      updateStats(updatedVendas);
      return { success: true };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao atualizar venda";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVenda = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta venda?")) {
      return { success: false };
    }

    setIsLoading(true);
    setError(null);

    try {
      await vendasService.delete(id);
      const updatedVendas = vendas.filter((v) => v.id !== id);
      setVendas(updatedVendas);
      updateStats(updatedVendas);
      return { success: true };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao excluir venda";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const getVendasByDateRange = async (dataInicio: string, dataFim: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await vendasService.getByPeriod(dataInicio, dataFim);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao filtrar vendas por data";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect com controle rigoroso para executar apenas uma vez
  useEffect(() => {
    if (!hasInitialized.current && !isInitialized) {
      hasInitialized.current = true;
      fetchVendas();
    }

    // Cleanup para cancelar requisições ao desmontar
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchVendas, isInitialized]);

  return {
    vendas,
    stats,
    isLoading,
    error,
    isInitialized,
    createVenda,
    updateVenda,
    deleteVenda,
    getVendasByDateRange,
    refetch: fetchVendas,
    clearError: () => setError(null),
  };
};

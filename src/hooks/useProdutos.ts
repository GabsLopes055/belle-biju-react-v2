import { useState, useEffect } from "react";
import { produtosService } from "../services/produtos.service";
import { Produto, ProdutoFormData } from "../types/produto.types";

export const useProdutos = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProdutos = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await produtosService.getAll();
      setProdutos(data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao carregar produtos";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const createProduto = async (produtoData: ProdutoFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const newProduto = await produtosService.create(produtoData);
      setProdutos((prev) => [newProduto, ...prev]);
      return { success: true };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao criar produto";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduto = async (id: string, produtoData: ProdutoFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedProduto = await produtosService.update(id, produtoData);
      setProdutos((prev) =>
        prev.map((p) => (p.idProduto === id ? updatedProduto : p))
      );
      return { success: true };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao atualizar produto";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduto = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) {
      return { success: false };
    }

    setIsLoading(true);
    setError(null);

    try {
      await produtosService.delete(id);
      setProdutos((prev) => prev.filter((p) => p.idProduto !== id));
      return { success: true };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao excluir produto";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  return {
    produtos,
    isLoading,
    error,
    createProduto,
    updateProduto,
    deleteProduto,
    refetch: fetchProdutos,
    clearError: () => setError(null),
  };
};

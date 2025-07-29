import api from "./api";
import { Produto, ProdutoFormData } from "../types/produto.types";

export const produtosService = {
  async getAll(): Promise<Produto[]> {
    try {
      const response = await api.get("/produto");
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error("Não autorizado. Faça login novamente.");
      }
      if (error.response?.status === 403) {
        throw new Error(
          "Acesso negado. Você não tem permissão para acessar produtos."
        );
      }
      if (error.response?.status === 500) {
        throw new Error(
          "Erro interno do servidor. Tente novamente mais tarde."
        );
      }

      throw new Error(
        error.response?.data?.message || "Erro ao carregar produtos"
      );
    }
  },

  async getById(id: string): Promise<Produto> {
    try {
      const response = await api.get(`/produto/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Produto não encontrado");
      }
      if (error.response?.status === 401) {
        throw new Error("Não autorizado. Faça login novamente.");
      }

      throw new Error(
        error.response?.data?.message || "Erro ao buscar produto"
      );
    }
  },

  async create(data: ProdutoFormData): Promise<Produto> {
    try {
      const response = await api.post("/produto", data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || "Dados inválidos";
        throw new Error(errorMessage);
      }
      if (error.response?.status === 401) {
        throw new Error("Não autorizado. Faça login novamente.");
      }

      throw new Error(error.response?.data?.message || "Erro ao criar produto");
    }
  },

  async update(id: string, data: ProdutoFormData): Promise<Produto> {
    try {
      const response = await api.put(`/produto/${id}`, data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Produto não encontrado");
      }
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || "Dados inválidos";
        throw new Error(errorMessage);
      }
      if (error.response?.status === 401) {
        throw new Error("Não autorizado. Faça login novamente.");
      }

      throw new Error(
        error.response?.data?.message || "Erro ao atualizar produto"
      );
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/produto/${id}`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Produto não encontrado");
      }
      if (error.response?.status === 401) {
        throw new Error("Não autorizado. Faça login novamente.");
      }
      if (error.response?.status === 403) {
        throw new Error(
          "Acesso negado. Você não tem permissão para excluir produtos."
        );
      }
      if (error.response?.status === 500) {
        throw new Error(
          "Erro interno do servidor. Não foi possível excluir o produto."
        );
      }

      throw new Error(
        error.response?.data?.message || "Erro ao excluir produto"
      );
    }
  },

  async search(nome: string): Promise<Produto[]> {
    try {
      const produtos = await this.getAll();
      return produtos.filter((produto) =>
        produto.nomeProduto.toLowerCase().includes(nome.toLowerCase())
      );
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      throw error;
    }
  },
};

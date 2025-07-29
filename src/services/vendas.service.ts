import api from "./api";
import { Venda, VendaFormData } from "../types/venda.types";
import { mockAPI } from "./mock-api";

// Verificar se estamos em desenvolvimento
const isDevelopment =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const vendasService = {
  async getAll(): Promise<Venda[]> {
    try {
      const response = await api.get("/vendas");
      return response.data;
    } catch (error: any) {
      // Em desenvolvimento, usar mock se houver erro de rede/CORS
      if (
        isDevelopment &&
        (error.code === "ERR_NETWORK" || error.message?.includes("CORS"))
      ) {
        console.warn(
          "🔧 Usando mock de vendas devido ao erro de rede em desenvolvimento"
        );
        return await mockAPI.getVendas();
      }

      if (error.response?.status === 401) {
        throw new Error("Não autorizado. Faça login novamente.");
      }
      if (error.response?.status === 403) {
        throw new Error(
          "Acesso negado. Você não tem permissão para acessar vendas."
        );
      }
      if (error.response?.status === 500) {
        throw new Error(
          "Erro interno do servidor. Tente novamente mais tarde."
        );
      }

      throw new Error(
        error.response?.data?.message || "Erro ao carregar vendas"
      );
    }
  },

  async getById(id: string): Promise<Venda> {
    try {
      const response = await api.get(`/vendas/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Venda não encontrada");
      }
      if (error.response?.status === 401) {
        throw new Error("Não autorizado. Faça login novamente.");
      }

      throw new Error(error.response?.data?.message || "Erro ao buscar venda");
    }
  },

  async create(data: VendaFormData): Promise<Venda> {
    try {
      const response = await api.post("/vendas", data);
      return response.data;
    } catch (error: any) {
      // Em desenvolvimento, simular criação
      if (
        isDevelopment &&
        (error.code === "ERR_NETWORK" || error.message?.includes("CORS"))
      ) {
        console.warn("🔧 Simulando criação de venda em desenvolvimento");
        const newVenda: Venda = {
          id: Date.now().toString(),
          ...data,
          createAt: new Date().toISOString(),
          updateAt: new Date().toISOString(),
        };
        return newVenda;
      }

      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || "Dados inválidos";
        throw new Error(errorMessage);
      }
      if (error.response?.status === 401) {
        throw new Error("Não autorizado. Faça login novamente.");
      }

      throw new Error(error.response?.data?.message || "Erro ao criar venda");
    }
  },

  async update(id: string, data: VendaFormData): Promise<Venda> {
    try {
      const response = await api.put(`/vendas/${id}`, data);
      return response.data;
    } catch (error: any) {
      // Em desenvolvimento, simular atualização
      if (
        isDevelopment &&
        (error.code === "ERR_NETWORK" || error.message?.includes("CORS"))
      ) {
        console.warn("🔧 Simulando atualização de venda em desenvolvimento");
        const updatedVenda: Venda = {
          id,
          ...data,
          createAt: new Date(Date.now() - 86400000).toISOString(), // Data anterior simulada
          updateAt: new Date().toISOString(),
        };
        return updatedVenda;
      }

      if (error.response?.status === 404) {
        throw new Error("Venda não encontrada");
      }
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || "Dados inválidos";
        throw new Error(errorMessage);
      }
      if (error.response?.status === 401) {
        throw new Error("Não autorizado. Faça login novamente.");
      }

      throw new Error(
        error.response?.data?.message || "Erro ao atualizar venda"
      );
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/vendas/${id}`);
    } catch (error: any) {
      // Em desenvolvimento, simular exclusão
      if (
        isDevelopment &&
        (error.code === "ERR_NETWORK" || error.message?.includes("CORS"))
      ) {
        console.warn("🔧 Simulando exclusão de venda em desenvolvimento");
        return; // Simular sucesso
      }

      if (error.response?.status === 404) {
        throw new Error("Venda não encontrada");
      }
      if (error.response?.status === 401) {
        throw new Error("Não autorizado. Faça login novamente.");
      }
      if (error.response?.status === 403) {
        throw new Error(
          "Acesso negado. Você não tem permissão para excluir vendas."
        );
      }
      if (error.response?.status === 400) {
        throw new Error("Não foi possível excluir a venda.");
      }

      throw new Error(error.response?.data?.message || "Erro ao excluir venda");
    }
  },

  async getByPeriod(inicio: string, fim: string): Promise<Venda[]> {
    try {
      const response = await api.post(`/vendas/${inicio}/${fim}`);
      return response.data;
    } catch (error: any) {
      // Em desenvolvimento, filtrar vendas mock por período
      if (
        isDevelopment &&
        (error.code === "ERR_NETWORK" || error.message?.includes("CORS"))
      ) {
        console.warn("🔧 Filtrando vendas mock por período em desenvolvimento");
        const allVendas = await mockAPI.getVendas();
        const inicioDate = new Date(inicio);
        const fimDate = new Date(fim);

        return allVendas.filter((venda) => {
          const vendaDate = new Date(venda.createAt);
          return vendaDate >= inicioDate && vendaDate <= fimDate;
        });
      }

      if (error.response?.status === 400) {
        throw new Error("Período inválido. Verifique as datas.");
      }
      if (error.response?.status === 401) {
        throw new Error("Não autorizado. Faça login novamente.");
      }

      throw new Error(
        error.response?.data?.message || "Erro ao buscar vendas por período"
      );
    }
  },

  async getStats() {
    try {
      const vendas = await this.getAll();
      const total = vendas.reduce((acc, venda) => acc + venda.total, 0);
      const produtos = vendas.reduce((acc, venda) => acc + venda.quantidade, 0);

      return {
        totalVendido: total,
        produtosVendidos: produtos,
        vendasRealizadas: vendas.length,
      };
    } catch (error) {
      console.error("Erro ao calcular estatísticas:", error);
      throw error;
    }
  },
};

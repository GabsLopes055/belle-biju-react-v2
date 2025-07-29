import api from "./api";
import {
  Usuario,
  UsuarioFormData,
  UsuarioRequest,
} from "../types/usuario.types";

export const usuariosService = {
  /**
   * Lista todos os usuários
   * GET /api/users
   */
  async getAll(): Promise<Usuario[]> {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error: any) {
      // Tratamento específico de erros baseado na documentação
      if (error.response?.status === 401) {
        throw new Error("Não autorizado. Faça login novamente.");
      }
      if (error.response?.status === 403) {
        throw new Error(
          "Acesso negado. Você não tem permissão para acessar usuários."
        );
      }
      if (error.response?.status === 500) {
        throw new Error(
          "Erro interno do servidor. Tente novamente mais tarde."
        );
      }

      throw new Error(
        error.response?.data?.message || "Erro ao carregar usuários"
      );
    }
  },

  /**
   * Busca usuário por ID
   * GET /api/users/{idUser}
   */
  async getById(id: string): Promise<Usuario> {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Usuário não encontrado");
      }
      if (error.response?.status === 401) {
        throw new Error("Não autorizado. Faça login novamente.");
      }

      throw new Error(
        error.response?.data?.message || "Erro ao buscar usuário"
      );
    }
  },

  /**
   * Cria novo usuário
   * POST /api/users/register
   */
  async create(data: UsuarioFormData): Promise<Usuario> {
    try {
      const requestData: UsuarioRequest = {
        nome: data.nome,
        username: data.username,
        password: data.password,
        roles: data.roles,
      };
      const response = await api.post("/users/register", requestData);
      return response.data;
    } catch (error: any) {
      // Tratamento específico de erros baseado na documentação
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || "Dados inválidos";
        throw new Error(errorMessage);
      }
      if (error.response?.status === 409) {
        throw new Error("Username já existe. Escolha outro username.");
      }
      if (error.response?.status === 401) {
        throw new Error("Não autorizado. Faça login novamente.");
      }

      throw new Error(error.response?.data?.message || "Erro ao criar usuário");
    }
  },

  /**
   * Atualiza usuário existente
   * PUT /api/users/{idUser}
   */
  async update(id: string, data: Partial<UsuarioFormData>): Promise<Usuario> {
    try {
      const requestData: Partial<UsuarioRequest> = {};
      if (data.nome) requestData.nome = data.nome;
      if (data.username) requestData.username = data.username;
      if (data.password) requestData.password = data.password;
      if (data.roles) requestData.roles = data.roles;

      const response = await api.put(`/users/${id}`, requestData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Usuário não encontrado");
      }
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || "Dados inválidos";
        throw new Error(errorMessage);
      }
      if (error.response?.status === 409) {
        throw new Error("Username já existe. Escolha outro username.");
      }
      if (error.response?.status === 401) {
        throw new Error("Não autorizado. Faça login novamente.");
      }

      throw new Error(
        error.response?.data?.message || "Erro ao atualizar usuário"
      );
    }
  },

  /**
   * Remove usuário
   * DELETE /api/users/{idUser}
   */
  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/users/${id}`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Usuário não encontrado");
      }
      if (error.response?.status === 401) {
        throw new Error("Não autorizado. Faça login novamente.");
      }
      if (error.response?.status === 403) {
        throw new Error(
          "Acesso negado. Você não tem permissão para excluir usuários."
        );
      }
      if (error.response?.status === 500) {
        throw new Error(
          "Erro interno do servidor. Não foi possível excluir o usuário."
        );
      }

      throw new Error(
        error.response?.data?.message || "Erro ao excluir usuário"
      );
    }
  },

  /**
   * Valida se um username já existe
   */
  async validateUsername(
    username: string,
    excludeId?: string
  ): Promise<boolean> {
    try {
      const usuarios = await this.getAll();
      const existingUser = usuarios.find(
        (u) =>
          u.username.toLowerCase() === username.toLowerCase() &&
          u.idUser !== excludeId
      );
      return !existingUser; // Retorna true se o username estiver disponível
    } catch (error) {
      console.error("Erro ao validar username:", error);
      return true; // Em caso de erro, assume que está disponível
    }
  },

  /**
   * Busca usuários por filtros
   */
  async search(filters: {
    nome?: string;
    username?: string;
    roles?: "ADMIN" | "USER";
  }): Promise<Usuario[]> {
    try {
      const usuarios = await this.getAll();

      return usuarios.filter((usuario) => {
        const matchesNome =
          !filters.nome ||
          usuario.nome.toLowerCase().includes(filters.nome.toLowerCase());
        const matchesUsername =
          !filters.username ||
          usuario.username
            .toLowerCase()
            .includes(filters.username.toLowerCase());
        const matchesRole = !filters.roles || usuario.roles === filters.roles;

        return matchesNome && matchesUsername && matchesRole;
      });
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      throw error;
    }
  },
};

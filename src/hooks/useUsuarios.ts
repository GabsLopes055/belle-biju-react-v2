import { useState, useEffect, useRef } from "react";
import { usuariosService } from "../services/usuarios.service";
import { Usuario, UsuarioFormData } from "../types/usuario.types";

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Refs para controle de estado
  const hasInitialized = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchUsuarios = async () => {
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
      const data = await usuariosService.getAll();
      // Garantir que data seja um array
      const usuariosArray = Array.isArray(data) ? data : [];
      setUsuarios(usuariosArray);
    } catch (err: any) {
      // Ignorar erros de cancelamento
      if (err.name === "AbortError") {
        return;
      }

      const errorMessage = err.message || "Erro ao carregar usuários";
      setError(errorMessage);
      setUsuarios([]); // Garantir que seja um array vazio em caso de erro
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
      abortControllerRef.current = null;
    }
  };

  const createUsuario = async (usuarioData: UsuarioFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const newUsuario = await usuariosService.create(usuarioData);
      setUsuarios((prev) => [newUsuario, ...prev]);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao criar usuário";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const updateUsuario = async (
    id: string,
    usuarioData: Partial<UsuarioFormData>
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedUsuario = await usuariosService.update(id, usuarioData);
      setUsuarios((prev) =>
        prev.map((u) => (u.idUser === id ? updatedUsuario : u))
      );
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao atualizar usuário";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUsuario = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) {
      return { success: false };
    }

    setIsLoading(true);
    setError(null);

    try {
      await usuariosService.delete(id);
      setUsuarios((prev) => prev.filter((u) => u.idUser !== id));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao excluir usuário";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const searchUsuarios = async (filters: {
    nome?: string;
    username?: string;
    roles?: "ADMIN" | "USER";
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const results = await usuariosService.search(filters);
      return results;
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao buscar usuários";
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const validateUsername = async (username: string, excludeId?: string) => {
    try {
      return await usuariosService.validateUsername(username, excludeId);
    } catch (err: any) {
      console.error("Erro ao validar username:", err);
      return true; // Em caso de erro, assume que está disponível
    }
  };

  const getUsuarioById = async (id: string) => {
    try {
      return await usuariosService.getById(id);
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao buscar usuário";
      setError(errorMessage);
      return null;
    }
  };

  // useEffect com controle rigoroso para executar apenas uma vez
  useEffect(() => {
    if (!hasInitialized.current && !isInitialized) {
      hasInitialized.current = true;
      fetchUsuarios();
    }

    // Cleanup para cancelar requisições ao desmontar
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [isInitialized]);

  return {
    usuarios,
    isLoading,
    error,
    isInitialized,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    searchUsuarios,
    validateUsername,
    getUsuarioById,
    refetch: fetchUsuarios,
    clearError: () => setError(null),
  };
};

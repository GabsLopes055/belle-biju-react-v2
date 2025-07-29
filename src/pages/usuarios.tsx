import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Edit,
  Trash2,
  UserPlus,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { Modal } from "../components/ui/modal";
import { useToast } from "../components/ui/toast";
import { useUsuarios } from "../hooks/useUsuarios";
import { Usuario, UsuarioFormData } from "../types/usuario.types";
import { formatDate } from "../utils/formatters";

export const UsuariosPage: React.FC = () => {
  const {
    usuarios,
    isLoading,
    error,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    validateUsername,
    refetch,
  } = useUsuarios();

  const { addToast, ToastContainer } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"nome" | "username" | "createdAt">(
    "nome"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showError, setShowError] = useState(false);

  const handleOpenModal = (usuario?: Usuario) => {
    setEditingUsuario(usuario || null);
    setIsModalOpen(true);
    setShowError(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUsuario(null);
    setShowError(false);
  };

  const handleSubmit = async (formData: UsuarioFormData) => {
    try {
      // Validar username em tempo real
      const isUsernameAvailable = await validateUsername(
        formData.username,
        editingUsuario?.idUser
      );

      if (!isUsernameAvailable) {
        addToast("error", "Username já está em uso. Escolha outro username.");
        setShowError(true);
        return;
      }

      if (editingUsuario) {
        const result = await updateUsuario(editingUsuario.idUser, formData);
        if (result.success) {
          addToast("success", "Usuário atualizado com sucesso!");
          handleCloseModal();
        } else {
          addToast("error", result.error || "Erro ao atualizar usuário");
          setShowError(true);
        }
      } else {
        const result = await createUsuario(formData);
        if (result.success) {
          addToast("success", "Usuário criado com sucesso!");
          handleCloseModal();
        } else {
          addToast("error", result.error || "Erro ao criar usuário");
          setShowError(true);
        }
      }
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      addToast("error", "Erro inesperado ao salvar usuário");
      setShowError(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        const result = await deleteUsuario(id);
        if (result.success) {
          addToast("success", "Usuário excluído com sucesso!");
        } else {
          addToast("error", result.error || "Erro ao excluir usuário");
        }
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        addToast("error", "Erro inesperado ao excluir usuário");
      }
    }
  };

  const handleRefresh = () => {
    refetch();
    addToast("info", "Lista de usuários atualizada");
  };

  // Garantir que usuarios seja um array
  const usuariosArray = Array.isArray(usuarios) ? usuarios : [];

  // Filtrar usuários
  const filteredUsuarios = usuariosArray.filter((usuario) => {
    const matchesSearch =
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || usuario.roles === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Ordenar usuários
  const sortedUsuarios = [...filteredUsuarios].sort((a, b) => {
    let aValue: string | Date;
    let bValue: string | Date;

    switch (sortBy) {
      case "nome":
        aValue = a.nome;
        bValue = b.nome;
        break;
      case "username":
        aValue = a.username;
        bValue = b.username;
        break;
      case "createdAt":
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      default:
        aValue = a.nome;
        bValue = b.nome;
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Estatísticas
  const totalUsuarios = usuariosArray.length;
  const adminsCount = usuariosArray.filter((u) => u.roles === "ADMIN").length;
  const usersCount = usuariosArray.filter((u) => u.roles === "USER").length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#770d7c] border-t-transparent shadow-lg"></div>
        <span className="ml-4 text-[#770d7c] text-lg font-medium">
          Carregando usuários...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Container */}
      <ToastContainer />

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gerenciamento de Usuários
          </h1>
          <p className="text-gray-600">Gerencie os usuários do sistema</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleRefresh}
            variant="secondary"
            size="sm"
            className="text-gray-600 hover:text-[#770d7c]"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button
            onClick={() => handleOpenModal()}
            className="bg-[#770d7c] hover:bg-[#5a0a5e] text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
      </div>

      {/* Mensagem de Erro */}
      {error && (
        <Card className="border border-red-200 bg-red-50">
          <div className="flex items-center space-x-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </Card>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-[#770d7c]/20">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#770d7c]">{totalUsuarios}</p>
            <p className="text-sm text-gray-600">Total de Usuários</p>
          </div>
        </Card>
        <Card className="border border-[#770d7c]/20">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#770d7c]">{adminsCount}</p>
            <p className="text-sm text-gray-600">Administradores</p>
          </div>
        </Card>
        <Card className="border border-[#770d7c]/20">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#770d7c]">{usersCount}</p>
            <p className="text-sm text-gray-600">Usuários Comuns</p>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="border border-[#770d7c]/20">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nome ou username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full sm:w-48"
              options={[
                { value: "all", label: "Todos os roles" },
                { value: "ADMIN", label: "Administrador" },
                { value: "USER", label: "Usuário" },
              ]}
            />
            <Select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortBy(field as "nome" | "username" | "createdAt");
                setSortOrder(order as "asc" | "desc");
              }}
              className="w-full sm:w-48"
              options={[
                { value: "nome-asc", label: "Nome (A-Z)" },
                { value: "nome-desc", label: "Nome (Z-A)" },
                { value: "username-asc", label: "Username (A-Z)" },
                { value: "username-desc", label: "Username (Z-A)" },
                { value: "createdAt-desc", label: "Mais Recentes" },
                { value: "createdAt-asc", label: "Mais Antigos" },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Lista de Usuários */}
      <div className="grid gap-4">
        {sortedUsuarios.length === 0 ? (
          <Card className="border border-[#770d7c]/20">
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">Nenhum usuário encontrado</p>
              <p className="text-gray-400 text-sm mt-2">
                {searchTerm || roleFilter !== "all"
                  ? "Tente ajustar os filtros de busca"
                  : "Clique em 'Novo Usuário' para adicionar o primeiro usuário"}
              </p>
            </div>
          </Card>
        ) : (
          sortedUsuarios.map((usuario) => (
            <Card key={usuario.idUser} className="border border-[#770d7c]/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#770d7c]/20 to-[#138182]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#770d7c] font-semibold text-lg">
                      {usuario.nome.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {usuario.nome}
                    </h3>
                    <p className="text-gray-600 text-sm">{usuario.username}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          usuario.roles === "ADMIN"
                            ? "bg-[#770d7c]/10 text-[#770d7c]"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {usuario.roles === "ADMIN"
                          ? "Administrador"
                          : "Usuário"}
                      </span>
                      <span className="text-xs text-gray-400">
                        Criado em {formatDate(usuario.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpenModal(usuario)}
                    className="text-gray-600 hover:text-[#770d7c]"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(usuario.idUser)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal de Usuário */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUsuario ? "Editar Usuário" : "Novo Usuário"}
        maxWidth="md"
      >
        <UsuarioForm
          usuario={editingUsuario}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          showError={showError}
          validateUsername={validateUsername}
        />
      </Modal>
    </div>
  );
};

interface UsuarioFormProps {
  usuario?: Usuario | null;
  onSubmit: (data: UsuarioFormData) => void;
  onCancel: () => void;
  showError: boolean;
  validateUsername: (username: string, excludeId?: string) => Promise<boolean>;
}

const UsuarioForm: React.FC<UsuarioFormProps> = ({
  usuario,
  onSubmit,
  onCancel,
  showError,
  validateUsername,
}) => {
  const [formData, setFormData] = useState({
    nome: usuario?.nome || "",
    username: usuario?.username || "",
    password: "",
    roles: usuario?.roles || "USER",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidatingUsername, setIsValidatingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );

  // Memoizar a função de validação para evitar re-renderizações
  const validateUsernameCallback = useCallback(
    async (username: string, excludeId?: string) => {
      if (username.length >= 3) {
        setIsValidatingUsername(true);
        try {
          const isAvailable = await validateUsername(username, excludeId);
          setUsernameAvailable(isAvailable);
          if (!isAvailable) {
            setErrors((prev) => ({
              ...prev,
              username: "Username já está em uso",
            }));
          } else {
            setErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors.username;
              return newErrors;
            });
          }
        } catch (error) {
          console.error("Erro ao validar username:", error);
        } finally {
          setIsValidatingUsername(false);
        }
      } else {
        setUsernameAvailable(null);
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.username;
          return newErrors;
        });
      }
    },
    [validateUsername]
  );

  // Validar username em tempo real com debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateUsernameCallback(formData.username, usuario?.idUser);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.username, usuario?.idUser, validateUsernameCallback]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username é obrigatório";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username deve ter pelo menos 3 caracteres";
    } else if (usernameAvailable === false) {
      newErrors.username = "Username já está em uso";
    }

    if (!usuario && !formData.password) {
      newErrors.password = "Senha é obrigatória para novos usuários";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (usuario && !formData.password) {
      // Para edição, se não forneceu senha, usar uma senha vazia
      onSubmit({ ...formData, password: "" });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Mensagem de erro geral */}
      {showError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">
              Erro ao salvar usuário. Tente novamente.
            </span>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome Completo *
        </label>
        <Input
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          placeholder="Digite o nome completo"
          error={errors.nome}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Username *
        </label>
        <div className="relative">
          <Input
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            placeholder="Digite o username"
            error={errors.username}
            required
          />
          {isValidatingUsername && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#770d7c] border-t-transparent"></div>
            </div>
          )}
          {usernameAvailable === true && formData.username.length >= 3 && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Senha {usuario && "(deixe em branco para manter a atual)"}
        </label>
        <Input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder="Digite a senha"
          error={errors.password}
          required={!usuario}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Usuário *
        </label>
        <Select
          value={formData.roles}
          onChange={(e) =>
            setFormData({
              ...formData,
              roles: e.target.value as "ADMIN" | "USER",
            })
          }
          options={[
            { value: "USER", label: "Usuário Comum" },
            { value: "ADMIN", label: "Administrador" },
          ]}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-[#770d7c] hover:bg-[#5a0a5e] text-white"
          disabled={isValidatingUsername || usernameAvailable === false}
        >
          {usuario ? "Atualizar Usuário" : "Criar Usuário"}
        </Button>
      </div>
    </form>
  );
};

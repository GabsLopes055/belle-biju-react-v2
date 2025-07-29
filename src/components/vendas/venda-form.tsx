import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Save, Calculator } from "lucide-react";
import { VendaFormData, Venda } from "../../types/venda.types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Modal } from "../ui/modal";

interface VendaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: VendaFormData
  ) => Promise<{ success: boolean; error?: string }>;
  venda?: Venda | null;
  isLoading?: boolean;
}

const formasPagamento = [
  { value: "DINHEIRO", label: "Dinheiro" },
  { value: "PIX", label: "PIX" },
  { value: "DEBITO", label: "Cartão de Débito" },
  { value: "CREDITO", label: "Cartão de Crédito" },
];

export const VendaForm: React.FC<VendaFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  venda,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<VendaFormData>({
    defaultValues: {
      nomeProduto: "",
      preco: 0,
      quantidade: 1,
      total: 0,
      formaPagamento: "DINHEIRO",
    },
  });

  const [error, setError] = useState<string | null>(null);

  // Observar mudanças nos campos para calcular total automaticamente
  const preco = watch("preco");
  const quantidade = watch("quantidade");

  // Calcular total automaticamente
  useEffect(() => {
    if (preco && quantidade) {
      const total = Number(preco) * Number(quantidade);
      setValue("total", Number(total.toFixed(2)));
    }
  }, [preco, quantidade, setValue]);

  // Preencher formulário quando venda for fornecida (modo edição)
  useEffect(() => {
    if (venda) {
      reset({
        nomeProduto: venda.nomeProduto,
        preco: venda.preco,
        quantidade: venda.quantidade,
        total: venda.total,
        formaPagamento: venda.formaPagamento,
      });
    } else {
      reset({
        nomeProduto: "",
        preco: 0,
        quantidade: 1,
        total: 0,
        formaPagamento: "DINHEIRO",
      });
    }
  }, [venda, reset]);

  const handleFormSubmit = async (data: VendaFormData) => {
    setError(null);

    try {
      const result = await onSubmit(data);
      if (result.success) {
        onClose();
        reset();
      } else {
        setError(result.error || "Erro ao salvar venda");
      }
    } catch (err: any) {
      setError(err.message || "Erro inesperado");
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={venda ? "Editar Venda" : "Nova Venda"}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Nome do Produto */}
        <Input
          label="Nome do Produto*"
          type="text"
          placeholder="Ex: Colar de Pérolas Elegante"
          error={errors.nomeProduto?.message}
          {...register("nomeProduto", {
            required: "Nome do produto é obrigatório",
            minLength: {
              value: 2,
              message: "Nome deve ter pelo menos 2 caracteres",
            },
            maxLength: {
              value: 100,
              message: "Nome não pode ter mais de 100 caracteres",
            },
          })}
        />

        {/* Grid com Preço e Quantidade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Preço Unitário (R$)*"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            error={errors.preco?.message}
            {...register("preco", {
              required: "Preço é obrigatório",
              min: {
                value: 0.01,
                message: "Preço deve ser maior que zero",
              },
              max: {
                value: 99999.99,
                message: "Preço muito alto",
              },
              valueAsNumber: true,
            })}
          />

          <Input
            label="Quantidade*"
            type="number"
            min="1"
            placeholder="1"
            error={errors.quantidade?.message}
            {...register("quantidade", {
              required: "Quantidade é obrigatória",
              min: {
                value: 1,
                message: "Quantidade deve ser pelo menos 1",
              },
              max: {
                value: 1000,
                message: "Quantidade muito alta",
              },
              valueAsNumber: true,
            })}
          />
        </div>

        {/* Total Calculado */}
        <div className="bg-[#770d7c]/5 border border-[#770d7c]/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Calculator className="h-5 w-5 text-[#770d7c]" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total da Venda
              </label>
              <Input
                type="number"
                step="0.01"
                readOnly
                className="bg-gray-50 text-lg font-semibold text-[#770d7c]"
                {...register("total", {
                  required: "Total é obrigatório",
                  min: {
                    value: 0.01,
                    message: "Total deve ser maior que zero",
                  },
                  valueAsNumber: true,
                })}
              />
            </div>
          </div>
        </div>

        {/* Forma de Pagamento */}
        <Select
          label="Forma de Pagamento*"
          error={errors.formaPagamento?.message}
          options={formasPagamento}
          placeholder="Selecione uma forma de pagamento"
          {...register("formaPagamento", {
            required: "Forma de pagamento é obrigatória",
          })}
        />

        {/* Botões */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <X size={16} />
            <span>Cancelar</span>
          </Button>

          <Button
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
            className="flex items-center space-x-2 bg-[#770d7c] hover:bg-[#770d7c]/90"
          >
            <Save size={16} />
            <span>{venda ? "Atualizar" : "Salvar"} Venda</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};

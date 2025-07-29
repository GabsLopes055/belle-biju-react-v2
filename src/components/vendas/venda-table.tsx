import React from "react";
import { Edit, Trash2, Calendar, CreditCard } from "lucide-react";
import { Venda } from "../../types/venda.types";
import { Button } from "../ui/button";

interface VendaTableProps {
  vendas: Venda[];
  onEdit: (venda: Venda) => void;
  onDelete: (venda: Venda) => void;
  isLoading?: boolean;
}

const formasPagamentoLabels = {
  DINHEIRO: "Dinheiro",
  PIX: "PIX",
  DEBITO: "Cartão de Débito",
  CREDITO: "Cartão de Crédito",
} as const;

const formasPagamentoCores = {
  DINHEIRO: "bg-green-100 text-green-800",
  PIX: "bg-blue-100 text-blue-800",
  DEBITO: "bg-purple-100 text-purple-800",
  CREDITO: "bg-orange-100 text-orange-800",
} as const;

export const VendaTable: React.FC<VendaTableProps> = ({
  vendas,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return "Data inválida";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#770d7c] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-500">Carregando vendas...</p>
        </div>
      </div>
    );
  }

  if (vendas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-8 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma venda encontrada
          </h3>
          <p className="text-gray-500 mb-6">
            Comece criando sua primeira venda clicando no botão "Nova Venda".
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produto
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preço Unit.
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qtd
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pagamento
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vendas.map((venda) => (
              <tr key={venda.id} className="hover:bg-gray-50 transition-colors">
                {/* Produto */}
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div
                      className="font-medium text-gray-900 truncate max-w-xs"
                      title={venda.nomeProduto}
                    >
                      {venda.nomeProduto}
                    </div>
                  </div>
                </td>

                {/* Preço Unitário */}
                <td className="px-6 py-4 text-right">
                  <span className="text-sm text-gray-900">
                    {formatCurrency(venda.preco)}
                  </span>
                </td>

                {/* Quantidade */}
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {venda.quantidade}
                  </span>
                </td>

                {/* Total */}
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-semibold text-[#770d7c]">
                    {formatCurrency(venda.total)}
                  </span>
                </td>

                {/* Forma de Pagamento */}
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      formasPagamentoCores[venda.formaPagamento]
                    }`}
                  >
                    {formasPagamentoLabels[venda.formaPagamento]}
                  </span>
                </td>

                {/* Data */}
                <td className="px-6 py-4 text-center">
                  <div className="text-sm text-gray-900 flex items-center justify-center space-x-1">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{formatDate(venda.createAt)}</span>
                  </div>
                </td>

                {/* Ações */}
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onEdit(venda)}
                      className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      title="Editar venda"
                    >
                      <Edit size={14} />
                    </Button>

                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onDelete(venda)}
                      className="hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Excluir venda"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumo na parte inferior */}
      <div className="border-t bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Total de vendas:{" "}
            <span className="font-medium">{vendas.length}</span>
          </span>
          <span className="text-gray-600">
            Valor total:{" "}
            <span className="font-semibold text-[#770d7c]">
              {formatCurrency(
                vendas.reduce((acc, venda) => acc + venda.total, 0)
              )}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

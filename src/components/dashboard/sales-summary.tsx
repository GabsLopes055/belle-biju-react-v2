import React from "react";
import { Calendar, Clock, TrendingUp } from "lucide-react";
import { Card } from "../ui/card";
import { formatCurrency, formatDate } from "../../utils/formatters";

interface SalesSummaryProps {
  vendasHoje?: number;
  totalHoje?: number;
  metaDiaria?: number;
}

export const SalesSummary: React.FC<SalesSummaryProps> = ({
  vendasHoje = 0,
  totalHoje = 0,
  metaDiaria = 1000,
}) => {
  const progressPercentage = Math.min((totalHoje / metaDiaria) * 100, 100);
  const isMetaAlcancada = totalHoje >= metaDiaria;

  return (
    <Card
      title="Resumo do Dia"
      subtitle={`${formatDate(new Date())} - ${new Date().toLocaleDateString(
        "pt-BR",
        { weekday: "long" }
      )}`}
      className="border border-[#770d7c]/20"
    >
      <div className="space-y-6">
        {/* Informações gerais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Vendas Hoje</p>
              <p className="text-xl font-semibold text-gray-900">
                {vendasHoje}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Faturamento</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(totalHoje)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Clock className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Último Update</p>
              <p className="text-xl font-semibold text-gray-900">
                {new Date().toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Meta diária */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Meta Diária
            </span>
            <span
              className={`text-sm font-medium ${
                isMetaAlcancada ? "text-gray-600" : "text-gray-600"
              }`}
            >
              {formatCurrency(totalHoje)} / {formatCurrency(metaDiaria)}
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                isMetaAlcancada ? "bg-green-500" : "bg-amber-500"
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-gray-600">
            <span>0%</span>
            <span className="font-medium">
              {progressPercentage.toFixed(1)}%
            </span>
            <span>100%</span>
          </div>
        </div>

        {isMetaAlcancada && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">
                🎉 Parabéns! Meta diária alcançada!
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

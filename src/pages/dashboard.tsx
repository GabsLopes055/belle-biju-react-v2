import React, { useEffect, useState } from "react";
import { StatsCards } from "../components/dashboard/stats-cards";
import { SalesSummary } from "../components/dashboard/sales-summary";
import { Card } from "../components/ui/card";
import { useVendas } from "../hooks/useVendas";
import { useAuth } from "../hooks/useAuth";
import { Clock, Activity } from "lucide-react";

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { vendas, stats, isLoading } = useVendas();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Atualizar horário a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Garantir que vendas seja um array e calcular dados do dia atual
  const vendasArray = Array.isArray(vendas) ? vendas : [];
  const today = new Date().toDateString();
  const vendasHoje = vendasArray.filter(
    (venda) => new Date(venda.createAt).toDateString() === today
  );

  const totalHoje = vendasHoje.reduce((acc, venda) => acc + venda.total, 0);
  const metaDiaria = 1500; // Meta exemplo

  // Atividades recentes (exemplo)
  const recentActivities = [
    {
      id: 1,
      action: "Nova venda registrada",
      item: "Colar Pérolas - R$ 89,90",
      time: "10 min atrás",
      type: "sale",
    },
    {
      id: 2,
      action: "Produto cadastrado",
      item: "Brincos Dourados",
      time: "25 min atrás",
      type: "product",
    },
    {
      id: 3,
      action: "Pagamento recebido",
      item: "PIX - R$ 156,00",
      time: "1h atrás",
      type: "payment",
    },
    {
      id: 4,
      action: "Usuário logado",
      item: user?.nome || "Usuário",
      time: "2h atrás",
      type: "user",
    },
  ];

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      sale: "🛒",
      product: "📦",
      payment: "💰",
      user: "👤",
    };
    return icons[type] || "📝";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#770d7c] border-t-transparent shadow-lg"></div>
        <span className="ml-4 text-[#770d7c] text-lg font-medium">
          Carregando dashboard...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-[#770d7c]/5 via-[#138182]/10 to-[#770d7c]/5 rounded-xl shadow-sm p-6 border border-[#770d7c]/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900">
              Olá, {user?.nome}! 👋
            </h1>
            <p className="text-gray-600">
              Bem-vindo ao dashboard do Belle Biju
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center text-gray-600 mb-1">
              <Clock size={16} className="mr-2" />
              <span className="text-sm">Agora</span>
            </div>
            <p className="text-xl font-semibold">
              {currentTime.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-sm text-gray-600">
              {currentTime.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <StatsCards
        totalVendido={stats?.totalVendido || 0}
        vendasRealizadas={stats?.vendasRealizadas || 0}
        produtosVendidos={stats?.produtosVendidos || 0}
        usuariosAtivos={5} // Exemplo
      />

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resumo de Vendas */}
        <div className="lg:col-span-2">
          <SalesSummary
            vendasHoje={vendasHoje.length}
            totalHoje={totalHoje}
            metaDiaria={metaDiaria}
          />
        </div>

        {/* Atividades Recentes */}
        <div className="lg:col-span-1">
          <Card
            title="Atividades Recentes"
            className="h-full border border-[#770d7c]/20"
          >
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-lg">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {activity.item}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}

              <div className="text-center pt-4">
                <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                  Ver todas as atividades
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Cards Informativos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          title="Status do Sistema"
          className="border-l-4 border-l-green-500"
        >
          <div className="flex items-center space-x-3">
            <Activity className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-lg font-semibold text-gray-900">
                Sistema Online
              </p>
              <p className="text-sm text-gray-600">
                Todos os serviços funcionando normalmente
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Última verificação: {currentTime.toLocaleTimeString("pt-BR")}
              </p>
            </div>
          </div>
        </Card>

        <Card title="Próximas Tarefas" className="border-l-4 border-l-blue-500">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Backup dos dados</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Pendente
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Relatório mensal</span>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                Em andamento
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                Atualização de estoque
              </span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Concluído
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

# 📊 Documentação Atualizada - Módulo de Gráficos Belle Biju

## Visão Geral

O módulo de gráficos do sistema Belle Biju foi completamente reestruturado e implementado seguindo as melhores práticas de React/TypeScript, utilizando **Chart.js** para visualização de dados de vendas. A implementação inclui dois tipos de gráficos principais, sistema de filtros por data, estatísticas em tempo real e interface moderna.

## 🎯 Funcionalidades Implementadas

### 1. **Gráfico de Barras Verticais** - Valor Vendido por Forma de Pagamento

- **Tipo**: Gráfico de barras verticais responsivo
- **Dados**: Valores monetários por forma de pagamento
- **Cores**: Esquema de cores específico (#138182, #770d7c, #7f5410, #822b0e)
- **Interatividade**: Tooltips e hover effects

### 2. **Gráfico de Pizza (Doughnut)** - Quantidade de Vendas por Forma de Pagamento

- **Tipo**: Gráfico de rosca (doughnut) responsivo
- **Dados**: Quantidade de transações por forma de pagamento
- **Cores**: Mesmo esquema de cores do gráfico de barras
- **Interatividade**: Legendas e animações

### 3. **Sistema de Filtros Avançado**

- **Períodos Predefinidos**: Hoje, Última Semana, Último Mês, Último Trimestre
- **Período Personalizado**: Modal com seleção de datas
- **Validação**: Campos obrigatórios e validação de período
- **Interface**: Botões rápidos e modal detalhado

### 4. **Dashboard de Estatísticas**

- **Total Vendido**: Valor monetário total no período
- **Vendas Realizadas**: Número de transações
- **Produtos Vendidos**: Quantidade de unidades
- **Forma Preferida**: Método de pagamento mais utilizado

## 🏗️ Arquitetura da Implementação

### Estrutura de Arquivos

```
src/components/graficos/
├── graficos-container.tsx      # Container principal
├── chart-bar-vertical.tsx      # Gráfico de barras
├── chart-doughnut.tsx          # Gráfico de pizza
├── date-filter.tsx             # Filtros de período
├── date-filter-modal.tsx       # Modal de filtro personalizado
├── stats-cards.tsx             # Cards de estatísticas
└── test-chart.tsx              # Componente de teste
```

### Dependências Principais

```json
{
  "dependencies": {
    "chart.js": "^4.4.2",
    "lucide-react": "^0.263.1",
    "react": "^18.2.0",
    "typescript": "^5.0.0"
  }
}
```

## 🔧 Implementação Técnica

### 1. Container Principal (`graficos-container.tsx`)

#### Estados e Lógica

```typescript
export const GraficosContainer: React.FC<GraficosContainerProps> = ({
  className = "",
}) => {
  const {
    pizzaData,
    totalVendasData,
    stats,
    isLoading,
    error,
    isInitialized,
    currentFilter,
    applyFilter,
    setPeriodPreset,
    refetch,
    clearError,
    getPeriodSummary,
    hasData,
  } = useGraficos();

  const [isCard, setIsCard] = useState(false);
  const [imagem, setImagem] = useState(true);
```

#### Handlers Principais

```typescript
// Handler para aplicar filtros com delay simulado
const handleFilter = async (filter: PeriodFilter) => {
  try {
    setIsCard(false);
    setImagem(false);

    await applyFilter(filter);

    // Simular delay como na documentação original
    setTimeout(() => {
      setIsCard(true);
      setImagem(false);
      addToast("success", "Gráficos atualizados com sucesso!");
    }, 2000);
  } catch (error: any) {
    addToast("error", error.message || "Erro ao aplicar filtros");
    setImagem(true);
    setIsCard(false);
  }
};
```

### 2. Gráfico de Barras Verticais (`chart-bar-vertical.tsx`)

#### Configuração Chart.js

```typescript
chartRef.current = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Dinheiro", "PIX", "Débito", "Crédito"],
    datasets: [
      {
        label: "Valor Vendido",
        data: data.dados,
        backgroundColor: ["#138182", "#770d7c", "#7f5410", "#822b0e"],
        borderColor: ["#138182", "#770d7c", "#7f5410", "#822b0e"],
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
```

### 3. Gráfico de Pizza (Doughnut) (`chart-doughnut.tsx`)

#### Configuração Chart.js

```typescript
chartRef.current = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Dinheiro", "PIX", "Débito", "Crédito"],
    datasets: [
      {
        data: data.dados,
        backgroundColor: ["#138182", "#770d7c", "#7f5410", "#822b0e"],
        borderColor: ["#138182", "#770d7c", "#7f5410", "#822b0e"],
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    cutout: "60%",
  },
});
```

### 4. Sistema de Filtros (`date-filter.tsx`)

#### Períodos Predefinidos

```typescript
export const PERIOD_PRESETS = [
  {
    id: "hoje",
    label: "Hoje",
    days: 0,
  },
  {
    id: "semana",
    label: "Última Semana",
    days: 7,
  },
  {
    id: "mes",
    label: "Último Mês",
    days: 30,
  },
  {
    id: "trimestre",
    label: "Último Trimestre",
    days: 90,
  },
] as const;
```

#### Modal de Filtro Personalizado

```typescript
export const DateFilterModal: React.FC<DateFilterModalProps> = ({
  isOpen,
  onClose,
  onFilter,
  isLoading = false,
}) => {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const handlePesquisarVendas = () => {
    if (!dataInicio || !dataFim) return;

    const inicio = new Date(dataInicio).toISOString().split("T")[0];
    const fim = new Date(dataFim).toISOString().split("T")[0];

    const filter: PeriodFilter = {
      dataInicio: inicio,
      dataFim: fim,
      periodo: "customizado",
    };

    onFilter(filter);
    onClose();
  };
```

### 5. Cards de Estatísticas (`stats-cards.tsx`)

#### Componente Reutilizável

```typescript
export const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  className = "",
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 ${className}`}>
      {/* Total Vendido */}
      <Card title="Total Vendido" className="border-l-4 border-l-green-500">
        <div className="flex items-center">
          <Target className="h-8 w-8 text-green-500 mr-3" />
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats.totalVendido)}
            </p>
            <p className="text-sm text-gray-600">No período</p>
          </div>
        </div>
      </Card>
      {/* ... outros cards */}
    </div>
  );
};
```

## 🎨 Esquema de Cores

### Paleta de Cores dos Gráficos

```typescript
// Cores específicas para cada forma de pagamento
const CHART_COLORS = {
  DINHEIRO: "#138182", // Verde-azulado
  PIX: "#770d7c", // Roxo
  DEBITO: "#7f5410", // Marrom
  CREDITO: "#822b0e", // Vermelho-escuro
  primary: "#770d7c", // Cor primária do projeto
  secondary: "#138182", // Cor secundária do projeto
} as const;
```

### Aplicação no Chart.js

```typescript
backgroundColor: ["#138182", "#770d7c", "#7f5410", "#822b0e"];
```

## 📊 Estrutura de Dados

### Tipos TypeScript

```typescript
// Tipos para o módulo de gráficos
export interface GraficoPizzaRequest {
  dataInicio: string;
  dataFim: string;
}

export interface GraficoPizzaResponse {
  dados: number[];
  labels: string[];
}

export interface GraficoTotalVendasResponse {
  dados: number[];
  labels: string[];
}

export interface GraficosStats {
  totalVendido: number;
  vendasRealizadas: number;
  produtosVendidos: number;
  formaPagamentoMaisUsada: string;
  periodoSelecionado: string;
  crescimentoComparado?: number;
}
```

### Formato dos Dados da API

```typescript
// Resposta da API para gráfico de barras (valores monetários)
{
  "dados": [1423.9, 3345.4, 3197.89, 2517.4], // Dinheiro, PIX, Débito, Crédito
  "labels": ["DINHEIRO", "PIX", "DEBITO", "CREDITO"]
}

// Resposta da API para gráfico de pizza (quantidades)
{
  "dados": [15, 23, 8, 12], // Dinheiro, PIX, Débito, Crédito
  "labels": ["DINHEIRO", "PIX", "DEBITO", "CREDITO"]
}
```

## 🔄 Fluxo de Funcionamento

### 1. **Carregamento Inicial**

- Exibe imagem de fundo com ícone de gráfico
- Botão "Pesquisar por Data" disponível
- Estados: `imagem = true`, `isCard = false`

### 2. **Seleção de Período**

- Usuário clica em "Pesquisar por Data"
- Modal abre com seletor de datas
- Validação de campos obrigatórios

### 3. **Busca de Dados**

- Formatação das datas para API (`yyyy-MM-dd`)
- Chamadas simultâneas para:
  - `/graficos/gerarGraficoPizza`
  - `/graficos/gerarGraficoTotalVendas`
- Armazenamento dos dados no hook

### 4. **Renderização dos Gráficos**

- Destruição de gráficos existentes
- Delay de 2 segundos (simulação de processamento)
- Criação dos novos gráficos com Chart.js
- Exibição dos cards informativos
- Estados: `imagem = false`, `isCard = true`

### 5. **Exibição dos Resultados**

- Gráfico de barras com valores monetários
- Gráfico de pizza com quantidades
- Cards informativos com valores detalhados
- Cálculo automático do total

## 🎯 Estados da Interface

### Estados Principais

```typescript
interface GraficosState {
  isLoading: boolean; // Progress bar ativo
  isCard: boolean; // Cards informativos visíveis
  imagem: boolean; // Imagem de fundo visível
  error: string | null; // Mensagem de erro
  hasData: boolean; // Se há dados para exibir
}
```

### Transições de Estado

1. **Inicial**: `imagem = true`, `isCard = false`, `isLoading = false`
2. **Carregando**: `isLoading = true`
3. **Com Dados**: `imagem = false`, `isCard = true`, `isLoading = false`
4. **Erro**: `error = "mensagem"`, `imagem = true`, `isCard = false`

## 🚀 Endpoints da API

### URLs dos Gráficos

```typescript
// Gráfico de pizza (quantidades)
POST /api/graficos/gerarGraficoPizza
Body: { dataInicio: "2024-01-01", dataFim: "2024-01-31" }

// Gráfico de barras (valores)
POST /api/graficos/gerarGraficoTotalVendas
Body: { dataInicio: "2024-01-01", dataFim: "2024-01-31" }
```

## 📱 Responsividade

### Layout Flexível

```css
/* Grid responsivo para gráficos */
.grid-cols-1.xl:grid-cols-2 {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

@media (min-width: 1280px) {
  .xl\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* Grid responsivo para cards de estatísticas */
.grid-cols-1.md:grid-cols-4 {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .md\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
```

## 🎨 Melhorias Implementadas

### Funcionalidades Adicionais

1. **Interface Moderna**: Design limpo e responsivo com TailwindCSS
2. **Animações**: Transições suaves entre estados
3. **Tooltips Personalizados**: Informações detalhadas no hover
4. **Filtros Avançados**: Períodos predefinidos e personalizados
5. **Modal de Filtro**: Interface intuitiva para seleção de datas
6. **Loading States**: Progress bar e spinners durante carregamento
7. **Error Handling**: Tratamento robusto de erros com retry
8. **Toast Notifications**: Feedback visual para ações do usuário

### Otimizações Técnicas

1. **Componentes Reutilizáveis**: StatsCards, DateFilter, etc.
2. **TypeScript**: Tipagem completa para melhor desenvolvimento
3. **Hooks Customizados**: useGraficos para lógica de negócio
4. **Mock API**: Dados de exemplo para desenvolvimento
5. **Responsividade**: Layout adaptável para diferentes telas
6. **Performance**: Lazy loading e destruição de gráficos
7. **Acessibilidade**: ARIA labels e navegação por teclado

## 🔧 Configurações do Chart.js

### Gráfico de Barras

```typescript
{
  type: 'bar',
  data: {
    labels: ['Dinheiro', 'PIX', 'Débito', 'Crédito'],
    datasets: [{
      label: 'Valor Vendido',
      data: [data[0], data[1], data[2], data[3]],
      backgroundColor: ['#138182', '#770d7c', '#7f5410', '#822b0e'],
    }],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
}
```

### Gráfico de Pizza (Doughnut)

```typescript
{
  type: 'doughnut',
  data: {
    labels: ['Dinheiro', 'PIX', 'Débito', 'Crédito'],
    datasets: [{
      data: [data[0], data[1], data[2], data[3]],
      backgroundColor: ['#138182', '#770d7c', '#7f5410', '#822b0e'],
    }],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    cutout: '60%',
  },
}
```

## 📋 Checklist de Implementação

### ✅ Funcionalidades Implementadas

- [x] Gráfico de barras verticais com Chart.js
- [x] Gráfico de pizza (doughnut) com Chart.js
- [x] Sistema de filtros por período
- [x] Modal de filtro personalizado
- [x] Cards de estatísticas
- [x] Interface responsiva
- [x] Loading states
- [x] Error handling
- [x] Toast notifications
- [x] TypeScript completo
- [x] Mock API para desenvolvimento
- [x] Esquema de cores consistente
- [x] Animações e transições
- [x] Acessibilidade básica

### 🔄 Próximas Melhorias

- [ ] Exportação de gráficos (PNG/PDF)
- [ ] Comparação de períodos
- [ ] Gráficos em tempo real (WebSocket)
- [ ] Filtros por produto/vendedor
- [ ] Análise de tendências
- [ ] Previsão de vendas
- [ ] Dashboard executivo
- [ ] Relatórios em PDF
- [ ] Integração com mais APIs

Esta implementação fornece uma base sólida e moderna para visualização de dados de vendas, seguindo as melhores práticas de desenvolvimento React/TypeScript e oferecendo uma experiência de usuário intuitiva e responsiva.

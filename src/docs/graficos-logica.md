# 📊 Lógica dos Gráficos - Sistema Belle Biju

## 🎯 **Especificação dos Dados**

### **Gráfico de Pizza (Formas de Pagamento)**

**Formato dos Dados:**

```typescript
// Exemplo dos valores do backend:
dados: [25, 23, 38, 14];

// Ordem SEMPRE fixa:
// dados[0] = Dinheiro
// dados[1] = PIX
// dados[2] = Débito
// dados[3] = Crédito
```

**Estrutura da Response:**

```typescript
GraficoPizzaResponse {
  dados: [25, 23, 38, 14],           // Valores na ordem fixa
  labels: ["DINHEIRO", "PIX", "DEBITO", "CREDITO"]  // Labels correspondentes
}
```

### **Gráfico de Barras (Total de Vendas)**

**Formato dos Dados:**

```typescript
// Exemplo para diferentes períodos:
GraficoTotalVendasResponse {
  dados: [1200, 1500, 980, 2100],    // Valores das vendas no tempo
  labels: ["Seg 01", "Ter 02", "Qua 03", "Qui 04"]  // Períodos correspondentes
}
```

## 🔧 **Implementação da Normalização**

### **1. Utilitários de Padronização**

```typescript
// src/utils/chart-helpers.ts

// Ordem padrão SEMPRE respeitada
export const FORMAS_PAGAMENTO_ORDER = ["DINHEIRO", "PIX", "DEBITO", "CREDITO"];

// Normalização automática dos dados
export const normalizeFormaPagamentoData = (
  dados: number[],
  labels: string[]
) => {
  const normalizedDados: number[] = [];
  const normalizedLabels: string[] = [];

  // Para cada forma de pagamento na ordem padrão
  FORMAS_PAGAMENTO_ORDER.forEach((formaPagamento) => {
    const index = labels.findIndex(
      (label) => label.toUpperCase() === formaPagamento
    );

    if (index !== -1) {
      // Se encontrou, usar o valor correspondente
      normalizedDados.push(dados[index] || 0);
    } else {
      // Se não encontrou, usar 0
      normalizedDados.push(0);
    }

    normalizedLabels.push(formaPagamento);
  });

  return { dados: normalizedDados, labels: normalizedLabels };
};
```

### **2. Aplicação nos Componentes**

```typescript
// src/components/graficos/chart-doughnut.tsx

const chartData = React.useMemo(() => {
  if (!data || !validateChartData(data.dados, data.labels)) {
    return { labels: [], datasets: [] };
  }

  // ✅ GARANTIA: Dados sempre na ordem [Dinheiro, PIX, Débito, Crédito]
  const normalizedData = normalizeFormaPagamentoData(data.dados, data.labels);

  // ✅ GARANTIA: Cores consistentes na ordem padrão
  const backgroundColor = getFormaPagamentoColors(); // [Verde, Roxo, Âmbar, Vermelho]

  return {
    labels: normalizedData.labels.map(
      (label) => FORMAS_PAGAMENTO_LABELS[label] || label
    ),
    datasets: [
      {
        data: normalizedData.dados, // Dados normalizados
        backgroundColor, // Cores na ordem
        // ... outras configurações
      },
    ],
  };
}, [data]);
```

### **3. Mock API Alinhado**

```typescript
// src/services/mock-api.ts

getGraficoPizza: async (_request: any) => {
  // ✅ MOCK segue a mesma lógica do backend
  return {
    dados: [1250.5, 2340.75, 980.25, 1890.0], // [Dinheiro, PIX, Débito, Crédito]
    labels: ["DINHEIRO", "PIX", "DEBITO", "CREDITO"],
  };
};
```

## 🎨 **Mapeamento Visual**

### **Cores Padronizadas:**

```typescript
const CHART_COLORS = [
  "#22c55e", // DINHEIRO - Verde
  "#8b5cf6", // PIX - Roxo
  "#f59e0b", // DEBITO - Âmbar
  "#ef4444", // CREDITO - Vermelho
];
```

### **Labels Traduzidas:**

```typescript
const FORMAS_PAGAMENTO_LABELS = {
  DINHEIRO: "Dinheiro",
  PIX: "PIX",
  DEBITO: "Cartão de Débito",
  CREDITO: "Cartão de Crédito",
};
```

## ✅ **Validações Implementadas**

### **1. Validação de Dados:**

```typescript
export const validateChartData = (
  dados: number[],
  labels: string[]
): boolean => {
  // ✅ Verificar existência
  if (!dados || !labels || dados.length === 0 || labels.length === 0) {
    return false;
  }

  // ✅ Verificar consistência
  if (dados.length !== labels.length) {
    console.warn("Arrays de dados e labels têm tamanhos diferentes");
    return false;
  }

  // ✅ Verificar valores válidos
  const hasInvalidNumbers = dados.some((valor) => isNaN(valor) || valor < 0);
  if (hasInvalidNumbers) {
    console.warn("Encontrados valores inválidos nos dados");
    return false;
  }

  return true;
};
```

### **2. Tratamento de Erros:**

```typescript
// src/services/graficos.service.ts

async getGraficosStats(dataInicio: string, dataFim: string) {
  try {
    const [pizzaData, totalVendasData] = await Promise.all([
      this.gerarGraficoPizza({ dataInicio, dataFim }),
      this.gerarGraficoTotalVendas({ dataInicio, dataFim })
    ]);

    // ✅ PROTEÇÃO: Verificar se os dados estão disponíveis
    const pizzaDados = pizzaData?.dados || [];
    const totalVendasDados = totalVendasData?.dados || [];
    const pizzaLabels = pizzaData?.labels || [];

    // ✅ CÁLCULOS seguros com verificação
    const totalVendido = pizzaDados.length > 0
      ? pizzaDados.reduce((acc, valor) => acc + valor, 0)
      : 0;

    // ... demais cálculos
  } catch (error) {
    console.error("Erro ao calcular estatísticas:", error);
    throw error;
  }
}
```

## 🚀 **Fluxo Completo**

### **1. Requisição → Backend/Mock:**

```
Frontend solicita: { dataInicio: "2024-01-01", dataFim: "2024-01-31" }
```

### **2. Backend/Mock Responde:**

```typescript
{
  dados: [1250.50, 2340.75, 980.25, 1890.00],  // Ordem fixa
  labels: ["DINHEIRO", "PIX", "DEBITO", "CREDITO"]
}
```

### **3. Frontend Normaliza:**

```typescript
// Dados passam pela normalização (mesmo se já corretos)
normalizeFormaPagamentoData(dados, labels);
// Resultado: sempre ordem [Dinheiro, PIX, Débito, Crédito]
```

### **4. Renderização:**

```typescript
// Chart.js recebe dados consistentes
<Doughnut
  data={{
    labels: ["Dinheiro", "PIX", "Cartão de Débito", "Cartão de Crédito"],
    datasets: [
      {
        data: [1250.5, 2340.75, 980.25, 1890.0],
        backgroundColor: ["#22c55e", "#8b5cf6", "#f59e0b", "#ef4444"],
      },
    ],
  }}
/>
```

## 🔍 **Pontos de Verificação**

✅ **Ordem dos dados sempre respeitada:** [Dinheiro, PIX, Débito, Crédito]  
✅ **Cores consistentes** para cada forma de pagamento  
✅ **Labels traduzidas** corretamente  
✅ **Validação robusta** de dados recebidos  
✅ **Tratamento de erros** sem crashes  
✅ **Mock API alinhado** com a lógica do backend  
✅ **Normalização automática** de dados inconsistentes

## 📋 **Testes de Validação**

### **Cenário 1: Dados Corretos**

```typescript
Input: { dados: [100, 200, 300, 400], labels: ["DINHEIRO", "PIX", "DEBITO", "CREDITO"] }
Output: Gráfico renderizado na ordem correta
```

### **Cenário 2: Dados Fora de Ordem**

```typescript
Input: { dados: [300, 100, 400, 200], labels: ["DEBITO", "DINHEIRO", "CREDITO", "PIX"] }
Output: Normalização reordena para [100, 200, 300, 400] automaticamente
```

### **Cenário 3: Dados Incompletos**

```typescript
Input: { dados: [100, 200], labels: ["DINHEIRO", "PIX"] }
Output: Normalização completa com [100, 200, 0, 0]
```

### **Cenário 4: Dados Inválidos**

```typescript
Input: { dados: undefined, labels: null }
Output: Exibe estado vazio sem crash
```

---

**✨ Sistema totalmente alinhado com a especificação: dados sempre na ordem [Dinheiro, PIX, Débito, Crédito]!**

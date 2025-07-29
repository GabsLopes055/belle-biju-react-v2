// Mock API para desenvolvimento local quando o backend não estiver disponível
export const mockAPI = {
  login: async (credentials: any) => {
    // Simular delay da rede
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Credenciais válidas para teste
    const validCredentials = [
      { username: "admin", password: "123" },
      { username: "user", password: "123" },
      { username: "test", password: "test" },
      { username: credentials.username, password: credentials.password }, // Aceitar qualquer credencial em desenvolvimento
    ];

    const isValid = validCredentials.some(
      (cred) =>
        cred.username === credentials.username &&
        cred.password === credentials.password
    );

    if (isValid) {
      return {
        token: `mock-token-${Date.now()}`,
        user: {
          id: "1",
          nome: credentials.username,
          username: credentials.username,
          roles: "USER",
        },
      };
    } else {
      throw new Error("Credenciais inválidas");
    }
  },

  validateToken: async () => {
    // Simular validação bem-sucedida em desenvolvimento
    return { valid: true };
  },

  getVendas: async () => {
    // Mock de vendas para desenvolvimento - formato correto do tipo Venda
    return [
      {
        id: "1",
        nomeProduto: "Colar de Pérolas Elegante",
        preco: 89.9,
        quantidade: 1,
        total: 89.9,
        formaPagamento: "PIX" as const,
        createAt: new Date().toISOString(),
        updateAt: new Date().toISOString(),
      },
      {
        id: "2",
        nomeProduto: "Brincos Dourados com Zircônia",
        preco: 45.0,
        quantidade: 2,
        total: 90.0,
        formaPagamento: "CREDITO" as const,
        createAt: new Date(Date.now() - 86400000).toISOString(), // ontem
        updateAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "3",
        nomeProduto: "Anel de Prata com Pedra Natural",
        preco: 156.0,
        quantidade: 1,
        total: 156.0,
        formaPagamento: "DINHEIRO" as const,
        createAt: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
        updateAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: "4",
        nomeProduto: "Pulseira de Ouro Delicada",
        preco: 234.0,
        quantidade: 1,
        total: 234.0,
        formaPagamento: "DEBITO" as const,
        createAt: new Date(Date.now() - 259200000).toISOString(), // 3 dias atrás
        updateAt: new Date(Date.now() - 259200000).toISOString(),
      },
      {
        id: "5",
        nomeProduto: "Conjunto de Brincos e Colar",
        preco: 189.9,
        quantidade: 1,
        total: 189.9,
        formaPagamento: "PIX" as const,
        createAt: new Date(Date.now() - 345600000).toISOString(), // 4 dias atrás
        updateAt: new Date(Date.now() - 345600000).toISOString(),
      },
    ];
  },

  getUsuarios: async () => {
    // Mock de usuários para desenvolvimento
    return [
      {
        idUser: "1",
        nome: "Administrador",
        username: "admin",
        roles: "ADMIN",
        createdAt: new Date().toISOString(),
      },
      {
        idUser: "2",
        nome: "Usuário Teste",
        username: "user",
        roles: "USER",
        createdAt: new Date().toISOString(),
      },
    ];
  },

  getGraficoPizza: async (_request: any) => {
    // Mock de gráfico de pizza para desenvolvimento
    // Simulando delay de rede como na documentação
    console.log("🎯 Mock API - getGraficoPizza chamado");
    await new Promise((resolve) => setTimeout(resolve, 800));

    // A API real retorna apenas array de dados
    // Valores sempre na ordem: [Dinheiro, PIX, Débito, Crédito]
    // Retornando quantidades (não valores monetários) conforme a documentação
    const response = [84, 101, 106, 59]; // Ordem: Dinheiro, PIX, Débito, Crédito (quantidades)

    console.log("🎯 Mock API - getGraficoPizza retornando:", response);
    console.log("🎯 Mock API - getGraficoPizza dados length:", response.length);
    console.log("🎯 Mock API - getGraficoPizza dados:", response);
    return response;
  },

  getGraficoTotalVendas: async (_request: any) => {
    // Mock de gráfico de barras para desenvolvimento
    // Simulando delay de rede como na documentação
    console.log("🎯 Mock API - getGraficoTotalVendas chamado");
    await new Promise((resolve) => setTimeout(resolve, 800));

    // A API real retorna apenas array de dados
    // Retornar dados de formas de pagamento na ordem: [Dinheiro, PIX, Débito, Crédito]
    // Usando valores realistas para uma loja de bijuterias
    const response = [1162.4, 2591.4, 2230.39, 1873.9]; // Ordem: Dinheiro, PIX, Débito, Crédito (valores em R$)

    console.log("🎯 Mock API - getGraficoTotalVendas retornando:", response);
    console.log(
      "🎯 Mock API - getGraficoTotalVendas dados length:",
      response.length
    );
    console.log("🎯 Mock API - getGraficoTotalVendas dados:", response);
    return response;
  },
};

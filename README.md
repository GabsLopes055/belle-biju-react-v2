# Belle Biju React v2

Sistema de gerenciamento completo para a Belle Biju, desenvolvido em React com TypeScript, incluindo dashboard, gráficos, autenticação e gerenciamento de vendas.

## 🚀 Tecnologias Utilizadas

- **React 19** - Biblioteca principal para interface
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **TailwindCSS** - Framework de estilização
- **Chart.js** - Gráficos e visualizações
- **React Router** - Roteamento
- **Zustand** - Gerenciamento de estado
- **React Query** - Gerenciamento de dados
- **React Hook Form** - Formulários
- **Lucide React** - Ícones
- **Axios** - Cliente HTTP

## 📋 Funcionalidades

### 🔐 Autenticação

- Sistema de login seguro
- Rotas protegidas
- Gerenciamento de sessão

### 📊 Dashboard

- Visão geral das vendas
- Cards de estatísticas
- Resumo de performance

### 📈 Gráficos

- Gráficos de barras (vertical e horizontal)
- Gráficos de rosca (doughnut)
- Filtros por data
- Dados em tempo real

### 💰 Vendas

- Cadastro de vendas
- Listagem com filtros
- Edição e exclusão
- Relatórios

### 👥 Usuários

- Gerenciamento de usuários
- Controle de acesso
- Perfis de usuário

### 📦 Produtos

- Cadastro de produtos
- Controle de estoque
- Categorização

## 🛠️ Instalação e Execução

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/belle-biju-react-v2.git

# Entre no diretório
cd belle-biju-react-v2

# Instale as dependências
npm install
```

### Execução

```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Linting
npm run lint
```

## 🎨 Cores do Sistema

O sistema utiliza uma paleta de cores personalizada:

- **Primária**: `#138182` (Verde-azulado)
- **Secundária**: `#770d7c` (Roxo)

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── auth/           # Componentes de autenticação
│   ├── dashboard/      # Componentes do dashboard
│   ├── graficos/       # Componentes de gráficos
│   ├── layout/         # Layout principal
│   ├── produtos/       # Componentes de produtos
│   ├── ui/             # Componentes de UI
│   ├── usuarios/       # Componentes de usuários
│   └── vendas/         # Componentes de vendas
├── hooks/              # Custom hooks
├── pages/              # Páginas da aplicação
├── services/           # Serviços de API
├── stores/             # Gerenciamento de estado
├── types/              # Definições de tipos TypeScript
└── utils/              # Utilitários e helpers
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Belle Biju
```

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:

- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚀 Deploy

### Vercel

```bash
npm run build
vercel --prod
```

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Desenvolvedor

**Gabriel** - Desenvolvedor Front-end Senior

## 📞 Suporte

Para suporte, envie um email para suporte@bellebiju.com ou abra uma issue no GitHub.

---

**Belle Biju React v2** - Sistema de gerenciamento moderno e eficiente 🚀

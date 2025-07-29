# Belle Biju Proxy Server

Proxy server para contornar problemas de CORS entre o frontend na Vercel e o backend no Railway.

## 🚀 Como usar

### 1. Instalar dependências

```bash
cd proxy-server
npm install
```

### 2. Executar localmente

```bash
npm start
# ou
npm run dev
```

### 3. Deploy no Railway

1. Crie um novo projeto no Railway
2. Conecte este diretório `proxy-server`
3. Railway detectará automaticamente o `package.json`
4. Deploy automático

### 4. Atualizar frontend

Após o deploy, atualize a `baseURL` no frontend para apontar para o proxy:

```typescript
// src/services/api.ts
const api = axios.create({
  baseURL: "https://seu-proxy-railway.up.railway.app/api",
  // ...
});
```

## 📡 Funcionalidades

- ✅ Proxy para todas as rotas `/api/*`
- ✅ CORS configurado para domínios da Vercel
- ✅ Health check em `/health`
- ✅ Logs detalhados de requisições
- ✅ Tratamento de erros

## 🔧 Configuração

O proxy redireciona todas as requisições de:

- **Origem**: `https://seu-proxy-railway.up.railway.app/api/*`
- **Destino**: `https://bellebiju-backend-production-5cda.up.railway.app/api/*`

## 📝 Logs

O proxy registra:

- 🌐 Requisições recebidas
- ✅ Respostas do backend
- ❌ Erros de conexão

## 🆘 Solução de Problemas

1. **Proxy não responde**: Verifique se o Railway está rodando
2. **Erro 500**: Verifique se o backend está online
3. **CORS ainda aparece**: Verifique se a URL do proxy está correta no frontend

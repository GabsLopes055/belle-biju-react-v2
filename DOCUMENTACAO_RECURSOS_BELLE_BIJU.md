# 📋 Documentação de Recursos - Belle Biju Backend

## 🏗️ Visão Geral do Projeto

O **Belle Biju** é um sistema de gerenciamento para loja de bijuterias desenvolvido em **Spring Boot 3.2.1** com **Java 17**. O projeto implementa um backend completo com autenticação JWT, CRUD de usuários, produtos e vendas, além de funcionalidades de relatórios e gráficos.

---

## 🛠️ Tecnologias Utilizadas

### Core Framework

- **Spring Boot 3.2.1**
- **Java 17**
- **Maven** (Gerenciador de dependências)

### Dependências Principais

- **Spring Data JPA** - Persistência de dados
- **Spring Security** - Autenticação e autorização
- **Spring Web** - APIs REST
- **Spring Validation** - Validação de dados
- **PostgreSQL** - Banco de dados
- **Lombok** - Redução de boilerplate
- **JWT (Auth0)** - Tokens de autenticação
- **SpringDoc OpenAPI** - Documentação da API
- **Spring DevTools** - Desenvolvimento

---

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

#### 1. **tbl_user** - Usuários do Sistema

```sql
- idUser (UUID, PK)
- nome (String, obrigatório)
- username (String, obrigatório, único)
- password (String, obrigatório, criptografada)
- roles (ENUM: ADMIN, USER)
- createdAt (LocalDateTime)
```

#### 2. **tbl_produto** - Produtos da Loja

```sql
- idProduto (UUID, PK)
- nomeProduto (String)
- precoProduto (Double)
```

#### 3. **tbl_vendas** - Registro de Vendas

```sql
- id (UUID, PK)
- nomeProduto (String)
- preco (Float)
- quantidade (Integer)
- total (Float)
- formaPagamento (ENUM: DINHEIRO, PIX, DEBITO, CREDITO)
- createAt (LocalDateTime)
- updateAt (LocalDateTime)
```

---

## 🔐 Sistema de Autenticação

### Configurações de Segurança

- **JWT Token** para autenticação
- **Spring Security** com filtros customizados
- **Criptografia de senhas** com BCrypt
- **CORS** habilitado para todas as origens

### Roles e Permissões

- **ADMIN** - Acesso total ao sistema
- **USER** - Acesso limitado

---

## 📡 APIs e Endpoints Disponíveis

### Base URL: `/api`

### 📋 **Resumo Completo de Endpoints**

| **Módulo**       | **Método** | **Endpoint**                            | **Descrição**        | **Status Codes** |
| ---------------- | ---------- | --------------------------------------- | -------------------- | ---------------- |
| **Autenticação** | POST       | `/api/authentication/login`             | Login do usuário     | 202, 400         |
| **Usuários**     | POST       | `/api/users/register`                   | Cadastra usuário     | 201              |
| **Usuários**     | GET        | `/api/users`                            | Lista todos usuários | 200              |
| **Usuários**     | PUT        | `/api/users/{idUser}`                   | Atualiza usuário     | 200              |
| **Usuários**     | DELETE     | `/api/users/{idUser}`                   | Remove usuário       | 200, 500         |
| **Produtos**     | GET        | `/api/produto`                          | Lista todos produtos | 200              |
| **Produtos**     | POST       | `/api/produto`                          | Cadastra produto     | 201              |
| **Vendas**       | POST       | `/api/vendas`                           | Registra venda       | 201              |
| **Vendas**       | GET        | `/api/vendas`                           | Lista todas vendas   | 200              |
| **Vendas**       | POST       | `/api/vendas/{inicio}/{fim}`            | Vendas por período   | 200              |
| **Vendas**       | PUT        | `/api/vendas/{idVenda}`                 | Atualiza venda       | 200              |
| **Vendas**       | DELETE     | `/api/vendas/{idVenda}`                 | Remove venda         | 200, 400         |
| **Gráficos**     | POST       | `/api/graficos/gerarGraficoPizza`       | Gráfico pizza        | 200              |
| **Gráficos**     | POST       | `/api/graficos/gerarGraficoTotalVendas` | Gráfico total vendas | 200              |

**Total de Endpoints**: 13 endpoints ativos

---

### 🔐 **Autenticação** - `/api/authentication`

#### **POST** `/api/authentication/login`

- **Descrição**: Realiza login do usuário
- **Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt_token_aqui"
  }
  ```
- **Status**: 202 (Accepted) ou 400 (Bad Request)

---

### 👥 **Usuários** - `/api/users`

#### **POST** `/api/users/register`

- **Descrição**: Cadastra novo usuário
- **Body**:
  ```json
  {
    "nome": "string",
    "username": "string",
    "password": "string",
    "roles": "ADMIN" | "USER"
  }
  ```
- **Response**: `UserResponse`
- **Status**: 201 (Created)

#### **GET** `/api/users`

- **Descrição**: Lista todos os usuários
- **Response**: `List<UserResponse>`
- **Status**: 200 (OK)

#### **PUT** `/api/users/{idUser}`

- **Descrição**: Atualiza usuário existente
- **Path Variable**: `idUser` (UUID)
- **Body**: `UserRequest`
- **Response**: `UserResponse`
- **Status**: 200 (OK)

#### **DELETE** `/api/users/{idUser}`

- **Descrição**: Remove usuário
- **Path Variable**: `idUser` (UUID)
- **Response**: String de confirmação
- **Status**: 200 (OK) ou 500 (Internal Server Error)

---

### 📦 **Produtos** - `/api/produto`

#### **GET** `/api/produto`

- **Descrição**: Lista todos os produtos
- **Response**: `List<ProdutoResponse>`
- **Status**: 200 (OK)

#### **POST** `/api/produto`

- **Descrição**: Cadastra novo produto
- **Body**:
  ```json
  {
    "nomeProduto": "string",
    "precoProduto": 0.0
  }
  ```
- **Response**: `ProdutoResponse`
- **Status**: 201 (Created)

> **⚠️ Nota**: O endpoint DELETE para produtos está comentado no código e não está implementado.

---

### 💰 **Vendas** - `/api/vendas`

#### **POST** `/api/vendas`

- **Descrição**: Registra nova venda
- **Body**:
  ```json
  {
    "nomeProduto": "string",
    "preco": 0.0,
    "quantidade": 0,
    "total": 0.0,
    "formaPagamento": "DINHEIRO" | "PIX" | "DEBITO" | "CREDITO"
  }
  ```
- **Response**: `VendasResponse`
- **Status**: 201 (Created)

#### **GET** `/api/vendas`

- **Descrição**: Lista todas as vendas
- **Response**: `List<VendasResponse>`
- **Status**: 200 (OK)

#### **POST** `/api/vendas/{inicio}/{fim}`

- **Descrição**: Lista vendas por período
- **Path Variables**:
  - `inicio` (String - data)
  - `fim` (String - data)
- **Response**: `List<VendasResponse>`
- **Status**: 200 (OK)

#### **PUT** `/api/vendas/{idVenda}`

- **Descrição**: Atualiza venda existente
- **Path Variable**: `idVenda` (UUID)
- **Body**: `VendasRequest`
- **Response**: `VendasResponse`
- **Status**: 200 (OK)

#### **DELETE** `/api/vendas/{idVenda}`

- **Descrição**: Remove venda
- **Path Variable**: `idVenda` (UUID)
- **Response**: String de confirmação
- **Status**: 200 (OK) ou 400 (Bad Request)

---

### 📊 **Gráficos e Relatórios** - `/api/graficos`

#### **POST** `/api/graficos/gerarGraficoPizza`

- **Descrição**: Gera gráfico de pizza com dados de vendas
- **Body**: `GraficoPizzaRequest`
- **Response**: `GraficoPizzaResponse`
- **Status**: 200 (OK)

#### **POST** `/api/graficos/gerarGraficoTotalVendas`

- **Descrição**: Gera gráfico de total de vendas
- **Body**: `GraficoPizzaRequest`
- **Response**: `GraficoPizzaResponse`
- **Status**: 200 (OK)

---

## 📋 DTOs (Data Transfer Objects)

### Requests

#### **UserRequest**

```json
{
  "nome": "string",
  "username": "string",
  "password": "string",
  "roles": "ADMIN" | "USER"
}
```

#### **LoginRequest**

```json
{
  "username": "string",
  "password": "string"
}
```

#### **ProdutoRequest**

```json
{
  "nomeProduto": "string",
  "precoProduto": 0.0
}
```

#### **VendasRequest**

```json
{
  "nomeProduto": "string",
  "preco": 0.0,
  "quantidade": 0,
  "total": 0.0,
  "formaPagamento": "DINHEIRO" | "PIX" | "DEBITO" | "CREDITO"
}
```

#### **GraficoPizzaRequest**

```json
{
  "dataInicio": "string",
  "dataFim": "string"
}
```

### Responses

#### **UserResponse**

```json
{
  "idUser": "uuid",
  "nome": "string",
  "username": "string",
  "roles": "ADMIN" | "USER",
  "createdAt": "datetime"
}
```

#### **AuthenticationToken**

```json
{
  "token": "jwt_token_aqui"
}
```

#### **ProdutoResponse**

```json
{
  "idProduto": "uuid",
  "nomeProduto": "string",
  "precoProduto": 0.0
}
```

#### **VendasResponse**

```json
{
  "id": "uuid",
  "nomeProduto": "string",
  "preco": 0.0,
  "quantidade": 0,
  "total": 0.0,
  "formaPagamento": "DINHEIRO" | "PIX" | "DEBITO" | "CREDITO",
  "createAt": "datetime",
  "updateAt": "datetime"
}
```

#### **GraficoPizzaResponse**

```json
{
  "dados": "array_de_dados",
  "labels": "array_de_labels"
}
```

---

## 🔧 Configurações

### Ambientes Disponíveis

- **Development** (`application-dev.properties`)
- **Production** (`application-prod.properties`)

### Configurações de Segurança

- **JWT Secret**: Configurado no `TokenService`
- **CORS**: Habilitado para todas as origens
- **BCrypt**: Para criptografia de senhas

---

## 🚀 Como Executar

### Pré-requisitos

- Java 17
- Maven 3.6+
- PostgreSQL

### Comandos

```bash
# Compilar o projeto
mvn clean compile

# Executar em modo desenvolvimento
mvn spring-boot:run -Dspring.profiles.active=dev

# Executar em modo produção
mvn spring-boot:run -Dspring.profiles.active=prod

# Gerar JAR executável
mvn clean package
```

---

## 📚 Documentação da API

O projeto utiliza **SpringDoc OpenAPI** para documentação automática da API. Após executar o projeto, acesse:

- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

---

## 🏗️ Arquitetura do Projeto

### Estrutura de Pacotes

```
com.belleBiju/
├── controllers/          # Controladores REST
├── DTOs/                # Data Transfer Objects
│   ├── requests/        # DTOs de entrada
│   └── responses/       # DTOs de saída
├── entities/            # Entidades JPA
│   └── Enums/          # Enumeradores
├── repository/          # Repositórios JPA
├── security/            # Configurações de segurança
└── service/             # Lógica de negócio
    └── exceptions/      # Exceções customizadas
```

### Padrões Utilizados

- **MVC** (Model-View-Controller)
- **Repository Pattern**
- **Service Layer Pattern**
- **DTO Pattern**
- **JWT Authentication**

---

## 🔍 Funcionalidades Principais

### ✅ Implementadas

- [x] CRUD completo de usuários
- [x] CRUD de produtos (parcial - falta DELETE)
- [x] CRUD completo de vendas
- [x] Autenticação JWT
- [x] Sistema de roles (ADMIN/USER)
- [x] Relatórios e gráficos
- [x] Validação de dados
- [x] Tratamento de exceções
- [x] CORS configurado
- [x] Documentação OpenAPI

### 🚧 Pendentes/Melhorias

- [ ] DELETE de produtos
- [ ] Busca de produtos por nome
- [ ] Paginação nas listagens
- [ ] Filtros avançados
- [ ] Logs de auditoria
- [ ] Backup automático
- [ ] Cache de dados
- [ ] Rate limiting
- [ ] Testes unitários
- [ ] Testes de integração

### 📝 **Endpoints Comentados/Pendentes**

#### **Produtos** - `/api/produto`

```java
// @DeleteMapping - COMENTADO NO CÓDIGO
// public ResponseEntity<String> deletarProduto(@PathVariable UUID idProduto)
```

**Status**: Endpoint DELETE para produtos está comentado no `ProdutoController.java` e não está implementado.

---

## 📊 **Estatísticas dos Endpoints**

### **Por Módulo**

- **Autenticação**: 1 endpoint
- **Usuários**: 4 endpoints (CRUD completo)
- **Produtos**: 2 endpoints (CRUD parcial - falta DELETE)
- **Vendas**: 5 endpoints (CRUD completo + filtros)
- **Gráficos**: 2 endpoints

### **Por Método HTTP**

- **GET**: 3 endpoints
- **POST**: 7 endpoints
- **PUT**: 2 endpoints
- **DELETE**: 1 endpoint

### **Status de Implementação**

- ✅ **Implementados**: 13 endpoints
- ❌ **Comentados/Pendentes**: 1 endpoint (DELETE produtos)
- 📊 **Cobertura**: 92.8% dos endpoints planejados

---

## 📞 Suporte

Para dúvidas ou sugestões sobre o projeto Belle Biju Backend, consulte a documentação da API através do Swagger UI ou entre em contato com a equipe de desenvolvimento.

---

_Documentação gerada em: Janeiro 2024_
_Versão do Projeto: 0.0.1-SNAPSHOT_

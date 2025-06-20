#  Closer - Sistema de Gerenciamento para Estúdios Fotográficos

![Closer](https://img.shields.io/badge/Closer-v1.0-blue?style=for-the-badge&logo=camera)

**Closer** é um sistema completo para gerenciamento de clientes, sessões fotográficas e pagamentos, desenvolvido para otimizar a rotina de estúdios fotográficos.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [🚀 Como Executar o Projeto](#-como-executar-o-projeto)
  - [Opção 1: Usando Docker (Recomendado)](#-opção-1-usando-docker-recomendado)
  - [Opção 2: Configuração Manual](#-opção-2-configuração-manual)
- [🗄️ Banco de Dados](#-banco-de-dados)
- [🧪 Testes](#-testes)
- [📝 Scripts Disponíveis](#-scripts-disponíveis)
- [🤝 Contribuição](#-contribuição)

---

## ✨ Visão Geral

Este sistema oferece as seguintes funcionalidades:

- **Dashboard Intuitivo:** Métricas e estatísticas em tempo real sobre clientes, sessões e finanças.
- **Gerenciamento de Clientes:** Cadastro, consulta e histórico completo de cada cliente.
- **Controle de Sessões:** Agendamento, status, tipos de serviço e controle de entrega de fotos.
- **Gestão de Pagamentos e Faturas:** Registro de pagamentos, controle de pendências e geração de faturas.
- **Interface Moderna e Responsiva:** Construído com React e Tailwind CSS para uma ótima experiência em qualquer dispositivo.

---

## 📁 Estrutura do Projeto

```
.
├── backend/          # API em NestJS + Prisma
├── frontend/         # Aplicação em React + TypeScript
└── docker-compose.yml # Orquestrador dos serviços
```

---

## 🛠️ Tecnologias Utilizadas

| Área      | Tecnologia                                                                                               |
| --------- | -------------------------------------------------------------------------------------------------------- |
| **Backend**   | [NestJS](https://nestjs.com/), [Prisma ORM](https://www.prisma.io/), [PostgreSQL](https://www.postgresql.org/), [TypeScript](https://www.typescriptlang.org/)     |
| **Frontend**  | [React 18](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), [Vite](https://vitejs.dev/), [Radix UI](https://www.radix-ui.com/) |
| **DevOps**    | [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/)                                                                          |

---

## 🚀 Como Executar o Projeto

Você pode executar o projeto de duas maneiras: usando Docker (recomendado para simplicidade) ou configurando o ambiente manualmente.

### Opção 1: Usando Docker (Recomendado)

Este é o método mais fácil e rápido para ter o ambiente completo funcionando.

**Pré-requisitos:**
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

**Passos:**

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/closer.git
    cd closer
    ```

2.  **Crie o arquivo de variáveis de ambiente para o backend:**
    Navegue até a pasta `backend` e crie um arquivo `.env` a partir do exemplo:
    ```bash
    cd backend
    cp .env.example .env
    cd ..
    ```
    *O arquivo `.env` já vem pré-configurado para se conectar ao banco de dados do Docker.*

3.  **Suba os serviços com Docker Compose:**
    Na raiz do projeto, execute o comando:
    ```bash
    docker-compose up --build
    ```

    Isso irá:
    - Construir as imagens do `backend` e do `frontend`.
    - Iniciar os três serviços: `database` (PostgreSQL), `backend` e `frontend`.
    - Aplicar as migrações do banco de dados automaticamente.

4.  **Acesse a aplicação:**
    - **Frontend:** [http://localhost:3007](http://localhost:3007)
    - **Backend API:** [http://localhost:3244](http://localhost:3244)

Para parar os serviços, pressione `Ctrl + C` no terminal e execute:
```bash
docker-compose down
```

---

### Opção 2: Configuração Manual

Use esta opção se preferir não usar o Docker.

**Pré-requisitos:**
- [Node.js](https://nodejs.org/) (v18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Uma instância do [PostgreSQL](https://www.postgresql.org/download/) rodando localmente.

**Passos:**

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/closer.git
    cd closer
    ```

2.  **Instale as dependências:**
    Na raiz do projeto, instale as dependências do `backend` e do `frontend`:
    ```bash
    npm install
    cd backend && npm install && cd ..
    cd frontend && npm install && cd ..
    ```

3.  **Configure o Banco de Dados:**
    - Garanta que seu PostgreSQL esteja ativo.
    - Crie um banco de dados (ex: `closerdb`).
    - Crie um arquivo `.env` na pasta `backend` e adicione a URL de conexão:
      ```env
      # backend/.env
      DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/closerdb"
      ```
    - Aplique as migrações do Prisma:
      ```bash
      cd backend
      npx prisma migrate dev
      cd ..
      ```

4.  **Execute a aplicação:**
    Você pode iniciar os dois serviços com um único comando a partir da raiz do projeto:
    ```bash
    npm run dev
    ```
    Ou, em terminais separados:
    ```bash
    # Terminal 1: Iniciar o Backend
    npm run dev:backend

    # Terminal 2: Iniciar o Frontend
    npm run dev:frontend
    ```

5.  **Acesse a aplicação:**
    - **Frontend:** [http://localhost:3007](http://localhost:3007)
    - **Backend API:** [http://localhost:3244](http://localhost:3244)

---

## 🗄️ Banco de Dados

Usamos o **Prisma ORM** para gerenciar o banco de dados. Os comandos mais comuns são executados a partir da pasta `backend/`:

- `npx prisma migrate dev`: Aplica novas migrações e gera o Prisma Client.
- `npx prisma generate`: Gera o Prisma Client manualmente após alterações no `schema.prisma`.
- `npx prisma studio`: Abre uma interface visual para explorar e editar os dados no banco.

---

## 🧪 Testes

Para executar os testes, utilize os seguintes comandos:

```bash
# Backend (na pasta backend/)
npm run test

# Frontend (na pasta frontend/)
npm test
```

---

## 📝 Scripts Disponíveis

| Script            | Descrição                                        |
| ----------------- | -------------------------------------------------- |
| `npm run dev`         | Inicia backend e frontend em modo de desenvolvimento. |
| `npm run dev:backend`   | Inicia apenas o backend.                           |
| `npm run dev:frontend`  | Inicia apenas o frontend.                          |
| `npm run build`       | Gera os builds de produção para ambos os projetos. |
| `npm start`         | Inicia a aplicação em modo de produção.            |

---

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Siga os passos abaixo:

1.  **Fork** o projeto.
2.  Crie uma nova branch: `git checkout -b feature/minha-feature`.
3.  Faça commit das suas alterações: `git commit -m 'Adiciona minha-feature'`.
4.  Envie para a branch: `git push origin feature/minha-feature`.
5.  Abra um **Pull Request**.

---

© 2025 Estudio Closer. Todos os direitos reservados.
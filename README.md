# 🧠 SaaS Backend - Gerenciador para Clínica de Psicologia

Este projeto é o backend de um sistema SaaS voltado para clínicas de psicologia. Ele permite o gerenciamento de pacientes, agendamentos, profissionais e outras funcionalidades essenciais para o funcionamento de uma clínica.

---

## 🚀 Tecnologias Utilizadas

- [NestJS](https://nestjs.com/) — Framework backend Node.js
- [PostgreSQL](https://www.postgresql.org/) — Banco de dados relacional
- [Supabase](https://supabase.com/) — Armazenamento e autenticação auxiliar
- [Redis](https://redis.io/) — Cache e gerenciamento de sessões
- [Docker](https://www.docker.com/) — Contêinerização para banco de dados e serviços

---

## ⚙️ Como rodar o projeto localmente

> **Pré-requisitos**:  
> - [Node.js](https://nodejs.org/) v23 ou superior  
> - [Docker](https://www.docker.com/)

### Passo a passo:

```bash
# 1. Instale as dependências
npm install

# 2. Suba os containers (Postgres, Redis, etc)
docker compose up -d

# 3. Inicie a aplicação
npm run start

    O servidor estará disponível em: http://localhost:3000

🔐 Autenticação

A autenticação é feita via JWT armazenado em cookies HTTP-only para maior segurança e controle de sessões.
📁 Estrutura do Projeto

src/
├── auth/              # Módulo de autenticação
├── users/             # Usuários da plataforma (admin, psicólogos, etc)
├── patients/          # Gestão de pacientes
├── appointments/      # Agendamentos e sessões
├── common/            # Middlewares, Pipes, Guards e Interceptors
├── config/            # Configuração de ambiente e integrações

🤝 Contribuindo

Contribuições são bem-vindas!
Sinta-se à vontade para abrir uma issue com dúvidas, sugestões ou problemas encontrados, ou envie um pull request com melhorias.

    Feito por Thauan Rodrigues
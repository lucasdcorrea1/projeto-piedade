<div align="center">

# Sistema Piedade

### Sistema de Gestao de Doacoes e Entregas

[![Frontend](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://lucasdcorrea1.github.io/projeto-piedade/)
[![Backend](https://img.shields.io/badge/Backend-Spring_Boot_3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://projeto-piedade.onrender.com/swagger-ui.html)
[![Database](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)]()
[![Deploy Frontend](https://img.shields.io/badge/Deploy-GitHub_Pages-222222?style=for-the-badge&logo=githubpages&logoColor=white)](https://lucasdcorrea1.github.io/projeto-piedade/)
[![Deploy Backend](https://img.shields.io/badge/Deploy-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://projeto-piedade.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)]()

---

**Sistema completo para gerenciamento de doacoes, entregas e acompanhamento de fieis.**
**Desenvolvido para facilitar o trabalho da obra de piedade.**

[Acessar Aplicacao](https://lucasdcorrea1.github.io/projeto-piedade/) · [API Docs (Swagger)](https://projeto-piedade.onrender.com/swagger-ui.html) · [Reportar Bug](https://github.com/lucasdcorrea1/projeto-piedade/issues)

</div>

---

## Funcionalidades

<table>
<tr>
<td width="50%">

### Dashboard Analitico
- Resumo em tempo real (fieis, doacoes, entregas)
- Grafico de doacoes dos ultimos 6 meses
- Entregas por bairro
- Top 5 itens mais doados
- Monitoramento de estoque com indicadores visuais
- Regioes atendidas

</td>
<td width="50%">

### Gestao de Fieis
- Cadastro completo com endereco
- Busca por nome, cidade ou bairro
- Historico de entregas por fiel
- Ativacao/desativacao (soft delete)
- Vinculacao por congregacao

</td>
</tr>
<tr>
<td width="50%">

### Controle de Doacoes
- Registro de doacoes com multiplos itens
- Rastreamento por origem
- Filtros por periodo e origem
- CRUD completo
- Calculo automatico de estoque

</td>
<td width="50%">

### Gestao de Entregas
- Criacao de entregas para fieis
- Status: Pendente / Entregue / Cancelada
- Atualizacao de status
- Filtros por periodo, status e fiel
- Historico completo

</td>
</tr>
<tr>
<td width="50%">

### Catalogo de Itens
- Categorias: Perecivel / Nao Perecivel
- Unidades de medida configuráveis
- Ativacao/desativacao
- Controle de estoque automatico

</td>
<td width="50%">

### Controle de Acesso
- Autenticacao JWT
- 3 perfis: Admin, Diacono, Cooperador
- Rotas protegidas por perfil
- Gestao de usuarios (admin)

</td>
</tr>
</table>

---

## Tech Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router_6-CA4245?style=flat-square&logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-FF6384?style=flat-square&logo=chart.js&logoColor=white)

### Backend
![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.2-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java_17-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=flat-square&logo=springsecurity&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger_UI-85EA2D?style=flat-square&logo=swagger&logoColor=black)

### Infraestrutura
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=flat-square&logo=githubpages&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white)

</div>

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTE (Browser)                        │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   GitHub Pages      │
                    │   React + Vite      │
                    │   Tailwind CSS      │
                    └──────────┬──────────┘
                               │ HTTPS (REST API)
                    ┌──────────▼──────────┐
                    │   Render            │
                    │   Spring Boot 3     │
                    │   JWT Auth          │
                    │   Swagger UI        │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   MongoDB Atlas     │
                    │   Cloud Database    │
                    └─────────────────────┘
```

---

## Endpoints da API

<details>
<summary><b>Auth</b> — <code>/api/auth</code></summary>

| Metodo | Rota | Descricao | Acesso |
|--------|------|-----------|--------|
| `POST` | `/login` | Autenticacao | Publico |
| `POST` | `/registro` | Registrar usuario | Admin |
| `GET` | `/me` | Usuario logado | Autenticado |

</details>

<details>
<summary><b>Fieis</b> — <code>/api/fieis</code></summary>

| Metodo | Rota | Descricao |
|--------|------|-----------|
| `GET` | `/` | Listar fieis (com filtros) |
| `GET` | `/{id}` | Buscar por ID |
| `GET` | `/{id}/historico` | Historico de entregas |
| `GET` | `/bairro/{bairro}` | Filtrar por bairro |
| `GET` | `/cidade/{cidade}` | Filtrar por cidade |
| `POST` | `/` | Cadastrar fiel |
| `PUT` | `/{id}` | Atualizar fiel |
| `DELETE` | `/{id}` | Desativar fiel |

</details>

<details>
<summary><b>Doacoes</b> — <code>/api/doacoes</code></summary>

| Metodo | Rota | Descricao |
|--------|------|-----------|
| `GET` | `/` | Listar doacoes (paginado) |
| `GET` | `/{id}` | Buscar por ID |
| `GET` | `/periodo` | Filtrar por periodo |
| `GET` | `/origem/{origem}` | Filtrar por origem |
| `POST` | `/` | Registrar doacao |
| `PUT` | `/{id}` | Atualizar doacao |
| `DELETE` | `/{id}` | Remover doacao |

</details>

<details>
<summary><b>Entregas</b> — <code>/api/entregas</code></summary>

| Metodo | Rota | Descricao |
|--------|------|-----------|
| `GET` | `/` | Listar entregas (paginado) |
| `GET` | `/{id}` | Buscar por ID |
| `GET` | `/fiel/{fielId}` | Entregas por fiel |
| `GET` | `/status/{status}` | Filtrar por status |
| `GET` | `/periodo` | Filtrar por periodo |
| `POST` | `/` | Registrar entrega |
| `PUT` | `/{id}` | Atualizar entrega |
| `PATCH` | `/{id}/status` | Atualizar status |
| `DELETE` | `/{id}` | Remover entrega |

</details>

<details>
<summary><b>Itens</b> — <code>/api/itens</code></summary>

| Metodo | Rota | Descricao |
|--------|------|-----------|
| `GET` | `/` ou `/ativos` | Listar itens ativos |
| `GET` | `/todos` | Listar todos os itens |
| `GET` | `/{id}` | Buscar por ID |
| `POST` | `/` | Criar item |
| `PUT` | `/{id}` | Atualizar item |
| `DELETE` | `/{id}` | Desativar item |

</details>

<details>
<summary><b>Dashboard</b> — <code>/api/dashboard</code></summary>

| Metodo | Rota | Descricao |
|--------|------|-----------|
| `GET` | `/resumo` | Resumo geral |
| `GET` | `/entregas-por-bairro` | Entregas agrupadas por bairro |
| `GET` | `/doacoes-por-periodo` | Doacoes agrupadas por mes |
| `GET` | `/itens-mais-doados` | Top 10 itens mais doados |
| `GET` | `/estoque` | Saldo de estoque atual |

</details>

---

## Rodando Localmente

### Pre-requisitos

- [Node.js 20+](https://nodejs.org/)
- [Java 17+](https://adoptium.net/)
- [Maven 3.9+](https://maven.apache.org/)
- [Docker](https://www.docker.com/) (opcional)

### Com Docker (recomendado)

```bash
git clone https://github.com/lucasdcorrea1/projeto-piedade.git
cd projeto-piedade
docker-compose up -d
```

| Servico | URL |
|---------|-----|
| Frontend | http://localhost:8081 |
| Backend | http://localhost:8888 |
| Swagger | http://localhost:8888/swagger-ui.html |
| MongoDB | localhost:27017 |

### Manual

**Backend:**
```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## Variaveis de Ambiente

### Backend

| Variavel | Descricao | Default |
|----------|-----------|---------|
| `SPRING_DATA_MONGODB_URI` | URI de conexao MongoDB | `mongodb://localhost:27017/piedade_db` |
| `JWT_SECRET` | Chave secreta para tokens JWT | - |
| `JWT_EXPIRATION` | Tempo de expiracao do token (ms) | `86400000` (24h) |
| `PORT` | Porta do servidor | `8888` |

### Frontend

| Variavel | Descricao | Default |
|----------|-----------|---------|
| `VITE_API_URL` | URL base da API | `/api` |

---

## Estrutura do Projeto

```
projeto-piedade/
│
├── frontend/                     # React SPA
│   ├── src/
│   │   ├── api/                  # Axios config
│   │   ├── components/           # Componentes reutilizaveis
│   │   │   ├── Layout.jsx        # Layout principal
│   │   │   ├── Sidebar.jsx       # Menu lateral (desktop)
│   │   │   ├── BottomNav.jsx     # Menu inferior (mobile)
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Pagination.jsx
│   │   ├── context/              # Context API (Auth)
│   │   ├── pages/                # Paginas da aplicacao
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── doacoes/
│   │   │   ├── entregas/
│   │   │   ├── fieis/
│   │   │   ├── itens/
│   │   │   └── usuarios/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Spring Boot API
│   ├── src/main/java/com/ccb/piedade/
│   │   ├── config/               # Security, CORS, MongoDB, OpenAPI
│   │   ├── controller/           # REST Controllers
│   │   ├── dto/                  # Data Transfer Objects
│   │   ├── exception/            # Exception handlers
│   │   ├── model/                # Entidades MongoDB
│   │   ├── repository/           # Repositorios
│   │   ├── security/             # JWT Filter & Provider
│   │   ├── service/              # Logica de negocio
│   │   ├── DataSeeder.java       # Seed inicial
│   │   └── PiedadeApplication.java
│   ├── Dockerfile
│   └── pom.xml
│
├── docker-compose.yml
├── render.yaml
└── README.md
```

---

## Perfis de Acesso

| Perfil | Permissoes |
|--------|-----------|
| **Admin** | Acesso total: usuarios, fieis, doacoes, entregas, itens, dashboard |
| **Diacono** | Fieis, doacoes, entregas, itens, dashboard |
| **Cooperador** | Visualizacao de fieis, doacoes e entregas |

---

## Deploy

| Componente | Plataforma | URL |
|-----------|-----------|-----|
| Frontend | GitHub Pages | [lucasdcorrea1.github.io/projeto-piedade](https://lucasdcorrea1.github.io/projeto-piedade/) |
| Backend | Render | [projeto-piedade.onrender.com](https://projeto-piedade.onrender.com) |
| Database | MongoDB Atlas | Cloud |
| CI/CD | GitHub Actions | Automatico no push para `main` |

---

<div align="center">

Feito com dedicacao para a obra de piedade

</div>

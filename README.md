# 🎬 EZSFLIX

> Portal completo de filmes e séries com autenticação, favoritos e avaliações

![React](https://img.shields.io/badge/React-18.0-61dafb?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18.0-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express&logoColor=white)

---

## 📚 Sobre o Projeto

**EZSFLIX** é uma aplicação web full-stack desenvolvida como **projeto final da disciplina de Desenvolvimento Web**, que permite aos usuários explorar, buscar, favoritar e avaliar filmes e séries utilizando dados em tempo real da API do The Movie Database (TMDB).

### 🎯 Objetivo Acadêmico

Este projeto foi desenvolvido para demonstrar o domínio de:
- Desenvolvimento Front-end com React
- Desenvolvimento Back-end com Node.js e Express
- Modelagem e manipulação de banco de dados MySQL
- Autenticação e segurança web (JWT, bcrypt)
- Integração com APIs RESTful externas
- Design responsivo e experiência do usuário

---

## ✨ Funcionalidades

### 🔐 Autenticação de Usuários
- Registro de novos usuários com validação
- Login seguro com JWT (JSON Web Tokens)
- Senha criptografada com bcrypt
- Sessão persistente

### 🔍 Busca e Exploração
- Busca em tempo real com sugestões automáticas
- Página dedicada de resultados
- Banner rotativo com 5 filmes em destaque
- Filmes e séries em alta da semana
- Navegação por categorias

### 🎬 Detalhes Completos
- Informações detalhadas: sinopse, avaliação, data de lançamento
- Elenco com fotos e personagens
- Trailers integrados do YouTube
- Gêneros e metadados

### ❤️ Sistema de Favoritos
- Adicionar/remover títulos dos favoritos
- Lista personalizada persistente
- Sincronização entre dispositivos
- Visual intuitivo com ícone de coração

### ⭐ Sistema de Avaliações
- Avaliação de 1 a 10 para cada título
- Salvamento automático no banco de dados
- Visualização das próprias avaliações
- Interface interativa com feedback visual

### 🎨 Interface Moderna
- Design responsivo (mobile, tablet, desktop)
- Tema escuro otimizado
- Animações suaves e transições
- Barras de scroll horizontais com navegação
- Banner com rotação automática e manual

---

## 🛠️ Tecnologias Utilizadas

### Front-end
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **React** | 18.x | Biblioteca JavaScript para construção de interfaces |
| **JavaScript ES6+** | - | Linguagem de programação |
| **Tailwind CSS** | 3.x | Framework CSS utility-first (via CDN) |
| **Lucide React** | Latest | Biblioteca de ícones moderna |
| **Fetch API** | - | Requisições HTTP |

### Back-end
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Node.js** | 18.x | Ambiente de execução JavaScript |
| **Express** | 4.x | Framework web minimalista |
| **MySQL2** | 3.x | Driver MySQL com suporte a Promises |
| **bcryptjs** | 2.x | Criptografia de senhas |
| **jsonwebtoken** | 9.x | Geração e validação de tokens JWT |
| **cors** | 2.x | Middleware para Cross-Origin Resource Sharing |
| **dotenv** | 16.x | Gerenciamento de variáveis de ambiente |
| **nodemon** | 3.x | Hot-reload para desenvolvimento |

### Banco de Dados
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **MySQL** | 8.x | Sistema de gerenciamento de banco de dados relacional |

### APIs Externas
| API | Descrição |
|-----|-----------|
| **The Movie Database (TMDB)** | Dados de filmes, séries, elenco e trailers |

---

## 📁 Estrutura do Projeto

```
ezsflix/
│
├── ezsfinder-backend/              # API REST (Node.js + Express)
│   ├── config/
│   │   └── database.js             # Configuração do pool de conexões MySQL
│   ├── routes/
│   │   ├── auth.js                 # Rotas de autenticação (login/registro)
│   │   ├── favorites.js            # Rotas de favoritos (CRUD)
│   │   └── ratings.js              # Rotas de avaliações (CRUD)
│   ├── middleware/
│   │   └── auth.js                 # Middleware de validação JWT
│   ├── .env.example                # Exemplo de variáveis de ambiente
│   ├── .gitignore                  # Arquivos ignorados pelo Git
│   ├── server.js                   # Servidor Express principal
│   └── package.json                # Dependências do back-end
│
├── ezsfinder-frontend/             # Interface React
│   ├── public/
│   │   └── index.html              # HTML base
│   ├── src/
│   │   ├── App.jsx                 # Componente principal (820 linhas)
│   │   ├── index.js                # Entrada da aplicação
│   │   └── index.css               # Estilos globais + Tailwind
│   ├── .gitignore                  # Arquivos ignorados pelo Git
│   └── package.json                # Dependências do front-end
│
├── database-schema.sql             # Schema do banco de dados
├── setup.bat                       # Script de instalação (Windows)
├── start.bat                       # Script de execução (Windows)
└── README.md                       # Este arquivo
```

---

## 🚀 Como Executar o Projeto

### 📋 Pré-requisitos

Antes de começar, você precisará ter instalado:

- [Node.js](https://nodejs.org/) (v14 ou superior)
- [MySQL](https://dev.mysql.com/downloads/mysql/) (v8 ou superior)
- [Git](https://git-scm.com/) (opcional)
- Editor de código (recomendado: [VS Code](https://code.visualstudio.com/))

### 📥 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/ezsflix.git
cd ezsflix
```

### 🗄️ 2. Configure o Banco de Dados

**Opção A - Via MySQL Workbench:**
1. Abra o MySQL Workbench
2. Conecte ao seu servidor MySQL
3. Vá em: **File → Open SQL Script**
4. Selecione o arquivo `database-schema.sql`
5. Execute o script (ícone de raio ⚡)

**Opção B - Via Terminal:**
```bash
mysql -u root -p < database-schema.sql
```

Isso criará:
- ✅ Banco de dados `ezsfinder`
- ✅ Tabela `usuarios` (id, nome, email, senha_hash)
- ✅ Tabela `favoritos` (id, usuario_id, titulo_id, tipo, titulo, poster_path, vote_average)
- ✅ Tabela `avaliacoes` (id, usuario_id, titulo_id, tipo, nota)

### 🔧 3. Configure o Back-end

```bash
cd ezsfinder-backend

# Instale as dependências
npm install

# Crie o arquivo .env baseado no exemplo
cp .env.example .env
```

**Edite o arquivo `.env` com suas credenciais:**
```env
PORT=5000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=sua_senha_mysql_aqui
DB_NAME=ezsfinder
DB_PORT=3306
JWT_SECRET=seu_secret_super_seguro_aqui
```

### 🎨 4. Configure o Front-end

```bash
cd ../ezsfinder-frontend

# Instale as dependências
npm install
```

**Obtenha uma API Key do TMDB:**
1. Acesse: https://www.themoviedb.org/
2. Crie uma conta gratuita
3. Vá em: **Configurações → API**
4. Copie a **API Key (v3)**
5. Abra o arquivo `src/App.jsx`
6. Na **linha 5**, cole sua API Key:
```javascript
const API_KEY = 'sua_api_key_aqui';
```

### ▶️ 5. Execute o Projeto

**Você precisa de 2 terminais abertos:**

**Terminal 1 - Back-end:**
```bash
cd ezsfinder-backend
npm run dev
```

Deve aparecer:
```
🚀 Servidor rodando em http://localhost:5000
✅ Conectado ao banco MySQL!
```

**Terminal 2 - Front-end:**
```bash
cd ezsfinder-frontend
npm start
```

O navegador abrirá automaticamente em: **http://localhost:3000**

### ✅ 6. Teste a Aplicação

1. **Crie uma conta:** Clique em "Entrar" → "Cadastre-se"
2. **Explore filmes:** Navegue pelo banner e listas
3. **Busque títulos:** Use a barra de pesquisa
4. **Favorite:** Clique no ícone de coração
5. **Avalie:** Entre nos detalhes e avalie de 1-10

---

## 🎮 Guia de Uso

### Criar Conta
1. Clique em **"Entrar"** (canto superior direito)
2. Clique em **"Não tem conta? Cadastre-se"**
3. Preencha: Nome, Email, Senha (mínimo 6 caracteres)
4. Clique em **"Criar Conta"**

### Buscar Filmes/Séries
- **Sugestões:** Digite na barra de busca (dropdown aparece)
- **Resultados completos:** Digite e pressione **Enter**
- **Detalhes:** Clique em qualquer card ou em "Ver Detalhes"

### Favoritar
- Clique no **ícone de coração** (em cards ou na página de detalhes)
- Veja todos em: **Ícone de coração no cabeçalho**

### Avaliar
1. Entre nos detalhes de um título
2. Role até "Sua Avaliação"
3. Clique em um número de **1 a 10**
4. Avaliação salva automaticamente!

### Banner Rotativo
- **Automático:** Troca a cada 5 segundos
- **Manual:** Setas aparecem ao passar o mouse
- **Direto:** Clique nas bolinhas indicadoras

---

## 📊 Arquitetura e Fluxo de Dados

### Arquitetura Geral
```
┌─────────────┐      HTTP/JSON      ┌─────────────┐
│             │ ←─────────────────→ │             │
│   React     │    REST API         │  Express    │
│  (Front-end)│                     │  (Back-end) │
│             │                     │             │
└─────────────┘                     └──────┬──────┘
                                           │
                                           │ SQL
                                           ▼
                                    ┌─────────────┐
                                    │    MySQL    │
                                    │  (Database) │
                                    └─────────────┘
```

### Fluxo de Autenticação
```
1. Usuário preenche formulário
   ↓
2. POST /api/auth/login → Back-end
   ↓
3. Back-end valida com bcrypt
   ↓
4. Gera token JWT
   ↓
5. Front-end armazena em localStorage
   ↓
6. Todas requisições incluem: Authorization: Bearer <token>
```

### Fluxo de Favoritar
```
1. Clique no coração (Front-end)
   ↓
2. Verifica se está logado
   ↓
3. POST /api/favorites + token JWT
   ↓
4. Middleware valida token
   ↓
5. INSERT no MySQL
   ↓
6. Retorna sucesso
   ↓
7. Front-end atualiza UI (coração vermelho)
```

---

## 📡 API Endpoints

### Autenticação
| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/api/auth/register` | Criar nova conta | Não |
| POST | `/api/auth/login` | Fazer login | Não |

**Exemplo - Registro:**
```json
POST /api/auth/register
Body: {
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456"
}

Response: {
  "message": "Usuário criado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com"
  }
}
```

### Favoritos
| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/favorites` | Listar favoritos | ✅ Sim |
| POST | `/api/favorites` | Adicionar favorito | ✅ Sim |
| DELETE | `/api/favorites/:id/:type` | Remover favorito | ✅ Sim |

**Exemplo - Adicionar Favorito:**
```json
POST /api/favorites
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "titulo_id": 550,
  "tipo": "movie",
  "titulo": "Clube da Luta",
  "poster_path": "/poster.jpg",
  "vote_average": 8.4
}

Response: {
  "message": "Favorito adicionado"
}
```

### Avaliações
| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/ratings` | Listar avaliações | ✅ Sim |
| POST | `/api/ratings` | Avaliar título | ✅ Sim |

**Exemplo - Avaliar:**
```json
POST /api/ratings
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "titulo_id": 550,
  "tipo": "movie",
  "nota": 9
}

Response: {
  "message": "Avaliação salva"
}
```

---

## 📈 Métricas do Projeto

### Linhas de Código
- **Front-end:** ~820 linhas (App.jsx)
- **Back-end:** ~250 linhas (total)
- **SQL:** ~60 linhas (schema)
- **Total:** ~1.130 linhas

### Componentes
- **7 componentes React** (App, MediaCard, ScrollableRow, AuthModal, HomePage, DetailsPage, SearchPage, FavoritesPage)
- **8 endpoints API** (2 auth, 3 favoritos, 2 avaliações, 1 health)
- **3 tabelas MySQL** (usuarios, favoritos, avaliacoes)

### Performance
- **Tempo de carregamento:** < 2s
- **Requisições por página:** 2-5 (otimizado)
- **Cache:** LocalStorage para token e sessão

---

## 🎓 Aprendizados e Desafios

### Principais Aprendizados
- ✅ Autenticação JWT completa do zero
- ✅ Relacionamentos complexos em MySQL
- ✅ Gerenciamento de estado React em aplicação grande
- ✅ Integração front-end ↔ back-end
- ✅ Segurança web (bcrypt, SQL Injection prevention)
- ✅ UX/UI com animações e responsividade

---

## 🤝 Contribuições

Este é um projeto acadêmico, mas sugestões são bem-vindas!

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como trabalho da disciplina de Desenvolvimento Web.

---

<div align="center">

**Desenvolvido como Projeto Final de Desenvolvimento Web**

**IFPR Campus Pinhais - 2025**

</div>

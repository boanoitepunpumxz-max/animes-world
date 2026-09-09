# ANIMES WORLD
> **YOUR ANIME. OUR WORLD.**

Plataforma completa de streaming de animes — Frontend React + Backend Node.js/Express + PostgreSQL.

---

## 📋 Requisitos

- Node.js 18+
- PostgreSQL 14+
- NPM 9+

---

## ⚡ Instalação Rápida

### 1. Clone / extraia o projeto
```bash
cd animes-world
```

### 2. Configure o banco de dados
```sql
-- No PostgreSQL, crie o banco:
CREATE DATABASE animesworld;
```

### 3. Configure as variáveis de ambiente
```bash
cd backend
cp .env.example .env
# Edite o .env com suas credenciais
```

### 4. Instale as dependências
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 5. Execute as migrations
```bash
cd backend
npm run migrate
```

### 6. Execute o seed (gêneros + admin)
```bash
npm run seed
```

### 7. Inicie em desenvolvimento
```bash
# Backend (terminal 1)
cd backend
npm run dev

# Frontend (terminal 2)
cd frontend
npm run dev
```

Acesse: http://localhost:5173

---

## 🔐 Credenciais Admin padrão

```
E-mail: admin@animesworld.com
Senha:  Admin@123456
```
> Altere imediatamente após o primeiro login em `/configuracoes`

---

## 🗂️ Estrutura do Projeto

```
animes-world/
├── backend/
│   ├── src/
│   │   ├── app.js               # Express app
│   │   ├── server.js            # Entry point
│   │   ├── controllers/         # Lógica de negócio
│   │   ├── routes/              # Definição de rotas
│   │   ├── middleware/          # Auth, logs, erros
│   │   ├── services/            # AniList, Email, Vídeo
│   │   ├── utils/               # DB pool
│   │   └── jobs/                # Cron jobs
│   ├── database/
│   │   ├── migrations/          # Schema SQL
│   │   └── seeds/               # Dados iniciais
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── anime/           # AnimeCard, HeroBanner, etc.
│   │   │   ├── layout/          # Header, Footer
│   │   │   ├── player/          # VideoPlayer, EpisodeList
│   │   │   └── ui/              # Componentes base
│   │   ├── pages/
│   │   │   ├── auth/            # Login, Register, etc.
│   │   │   ├── admin/           # Painel admin
│   │   │   └── *.jsx            # Páginas principais
│   │   ├── context/             # AuthContext
│   │   ├── hooks/               # useDebounce, useFetch
│   │   └── services/            # api.js (Axios)
│   └── vite.config.js
│
└── README.md
```

---

## 🎬 Configurando Episódios

O sistema de episódios é **modular**. Configure no `.env`:

```env
EPISODE_SOURCE=manual   # manual | embed | hls | custom
VIDEO_BASE_URL=         # Para modo embed
STREAM_SOURCE=          # Para modo HLS
```

### Modo manual (padrão)
1. Acesse `/admin/episodios`
2. Cole o UUID do anime
3. Crie o episódio
4. Clique em "Gerenciar fontes"
5. Adicione a URL do vídeo

**Tipos de fonte suportados:**
- `embed` — iframe/embed externo
- `hls` — stream `.m3u8`
- `mp4` — arquivo direto
- `iframe` — embed iframe
- `custom` — implementação própria

---

## 🔄 Sincronização do Catálogo

O catálogo é populado via **AniList API** (gratuita):

```bash
# Manual via painel admin:
# /admin/sincronizacao → Sincronizar Agora

# Automático: todo dia às 03:00
```

---

## 🛡️ Segurança e Monitoramento de IPs

O painel admin (`/admin/seguranca`) exibe:
- Todos os acessos com IP e user-agent
- Tentativas de login (sucesso e falha)
- Detecção automática de brute-force (bloqueia após 10 tentativas)

---

## 🚀 Deploy em Produção

### Backend
```bash
cd backend
npm start
```

Use **PM2** para produção:
```bash
npm install -g pm2
pm2 start src/server.js --name animes-world-api
pm2 save
pm2 startup
```

### Frontend
```bash
cd frontend
npm run build
# Servir a pasta dist/ com Nginx ou similar
```

### Nginx (exemplo)
```nginx
server {
    listen 80;
    server_name animesworld.com;

    # Frontend
    location / {
        root /var/www/animes-world/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL (Let's Encrypt)
```bash
sudo certbot --nginx -d animesworld.com
```

---

## 📡 API Health Check

```
GET /api/health
→ { "status": "ok", "database": "connected" }
```

---

## 📝 Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|---|---|---|
| `DATABASE_URL` | URL completa do PostgreSQL | ✅ |
| `JWT_SECRET` | Secret para tokens JWT (32+ chars) | ✅ |
| `SESSION_SECRET` | Secret das sessões | ✅ |
| `SMTP_HOST` | Servidor SMTP | Para e-mails |
| `SMTP_USER` | Usuário SMTP | Para e-mails |
| `SMTP_PASSWORD` | Senha SMTP | Para e-mails |
| `EPISODE_SOURCE` | Modo de fonte de vídeos | ⬜ |
| `VIDEO_BASE_URL` | Base URL para modo embed | ⬜ |
| `STREAM_SOURCE` | URL para modo HLS | ⬜ |
| `ADMIN_EMAIL` | E-mail do admin inicial | ⬜ |
| `ADMIN_PASSWORD` | Senha do admin inicial | ⬜ |

---

## 🎯 Rotas da Plataforma

| Rota | Descrição |
|---|---|
| `/login` | Tela de login |
| `/register` | Criação de conta |
| `/home` | Home principal |
| `/animes` | Catálogo com filtros |
| `/anime/:slug` | Página do anime |
| `/watch/:slug/:episodeId` | Player |
| `/generos` | Lista de gêneros |
| `/populares` | Animes populares |
| `/temporadas` | Por temporada/ano |
| `/minha-lista` | Lista do usuário |
| `/historico` | Histórico |
| `/perfil` | Perfil |
| `/configuracoes` | Configurações |
| `/admin` | Painel admin |
| `/admin/seguranca` | Logs de IP e segurança |

---

© ANIMES WORLD — YOUR ANIME. OUR WORLD.

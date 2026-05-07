# Gnos Platform

> **Automação. Marketing. Software.**  
> Conhecimento que move negócios.

Monorepo da plataforma Gnos — construído com Turborepo, TypeScript, Next.js, Fastify e Supabase.

---

## 🏗️ Estrutura

```
gnos/
├── apps/
│   ├── web/          # Site principal (Next.js) — vitrine + showcase
│   ├── portal/       # Portal do cliente (Next.js) — SaaS
│   └── api/          # Backend (Fastify) — API + EventBus
├── packages/
│   ├── ui/           # Componentes compartilhados
│   ├── database/     # Prisma schema + client
│   └── config/       # Configs: ESLint, TypeScript, Tailwind
└── tools/
    └── n8n/          # Workflows de automação (JSON exports)
```

---

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+
- pnpm 9+
- Docker Desktop

### Setup

```bash
# 1. Clone o repositório
git clone https://github.com/gnos/platform.git
cd platform

# 2. Copie as variáveis de ambiente
cp .env.example .env
# Edite o .env com seus valores

# 3. Instale as dependências
pnpm install

# 4. Suba o ambiente local
docker compose up -d

# 5. Rode as migrations do banco
pnpm db:migrate

# 6. Inicie todos os apps em dev
pnpm dev
```

### Comandos individuais

```bash
pnpm dev:web      # Só o site (porta 3000)
pnpm dev:portal   # Só o portal (porta 3002)
pnpm dev:api      # Só a API (porta 3001)

pnpm db:studio    # Abre o Prisma Studio
pnpm db:migrate   # Roda migrations
pnpm check-types  # Verifica TypeScript em todo monorepo
pnpm lint         # Lint em todo monorepo
```

---

## 🐳 Serviços Docker (dev local)

| Serviço    | URL                   | Credenciais          |
|------------|-----------------------|----------------------|
| PostgreSQL | `localhost:5432`      | `postgres/postgres`  |
| N8N        | `http://localhost:5678` | `admin/gnos-secret` |
| Redis      | `localhost:6379`      | —                    |
| API        | `http://localhost:3001` | —                   |

---

## 🧠 Arquitetura de Eventos

A API usa um `EventBus` com transport abstrato. Todos os eventos de domínio são tipados em `apps/api/src/events/domain-events.ts`.

**Transport atual:** N8N Webhook  
**Próximo:** Redis BullMQ (Fase 2)  
**Futuro:** Kafka (quando a escala exigir)

```typescript
import { eventBus } from './events/event-bus.js'

await eventBus.emit({
  type: 'lead.created',
  payload: { name: 'João', email: 'joao@empresa.com', service: 'AUTOMATION' }
})
```

---

## 📋 Bounded Contexts

| Context | Domínio | Tabelas |
|---|---|---|
| **Marketing/Leads** | Site, captação | `leads` |
| **Clientes/Portal** | Portal SaaS | `clients`, `projects`, `deliveries` |
| **Automações** | N8N templates | `automation_templates`, `automation_executions` |

> **Regra:** Nunca fazer JOIN entre bounded contexts. Referencie por ID e comunique via API.

---

## 🛠️ Stack

- **Monorepo:** Turborepo + pnpm workspaces
- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Animações:** GSAP + ScrollTrigger + Three.js
- **Backend:** Fastify + TypeScript
- **Banco:** Supabase (PostgreSQL) + Prisma
- **Eventos:** EventBus → N8N → Redis → Kafka
- **Automações:** N8N (self-hosted)
- **Email:** Resend
- **CMS:** Sanity.io
- **Deploy:** Vercel (web/portal) + Railway (api)

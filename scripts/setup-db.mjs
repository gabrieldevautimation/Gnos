#!/usr/bin/env node
// ─── Gnos — Script de Setup do Banco de Dados ────────────────────────────────
// Roda após subir o Docker: node scripts/setup-db.mjs
// O que faz: verifica conexão → roda migrations → roda seed

import { execSync } from 'child_process'

const run = (cmd, opts = {}) => {
  console.log(`\n→ ${cmd}`)
  execSync(cmd, { stdio: 'inherit', cwd: process.cwd(), ...opts })
}

console.log('🚀 Gnos — Setup do banco de dados\n')

// 1. Verifica se o banco está acessível
console.log('1️⃣  Verificando conexão com o PostgreSQL...')
try {
  run('pnpm --filter @gnos/database exec prisma db execute --stdin <<< "SELECT 1;"')
} catch {
  console.error('\n❌ PostgreSQL não está acessível.')
  console.error('   Certifique-se que o Docker está rodando:')
  console.error('   docker compose up -d postgres\n')
  process.exit(1)
}

// 2. Roda migrations
console.log('\n2️⃣  Rodando migrations...')
run('pnpm --filter @gnos/database db:migrate')

// 3. Gera client
console.log('\n3️⃣  Gerando Prisma Client...')
run('pnpm --filter @gnos/database db:generate')

// 4. Roda seed
console.log('\n4️⃣  Rodando seed...')
run('pnpm --filter @gnos/database db:seed')

console.log('\n✅ Banco configurado com sucesso!')
console.log('   Prisma Studio: pnpm db:studio\n')

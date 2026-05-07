import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'

const app = Fastify({
  logger: {
    level: process.env.LOG_LEVEL ?? 'info',
    transport:
      process.env.NODE_ENV === 'development'
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined,
  },
})

// ─── Plugins ─────────────────────────────────────────────────────────────────

await app.register(helmet)
await app.register(cors, {
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
})
await app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
})

// ─── Routes ──────────────────────────────────────────────────────────────────

app.get('/health', async () => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
  version: process.env.npm_package_version ?? '0.0.1',
}))

// ─── Bootstrap ───────────────────────────────────────────────────────────────

try {
  const port = Number(process.env.PORT ?? 3001)
  const host = process.env.HOST ?? '0.0.0.0'
  await app.listen({ port, host })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}

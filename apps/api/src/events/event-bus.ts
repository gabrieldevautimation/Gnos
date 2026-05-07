import type { DomainEvent } from './domain-events.js'

// ─── Transport Interface ──────────────────────────────────────────────────────
// Abstração do transporte de mensagens.
// Hoje: N8N Webhook. Amanhã: Redis BullMQ. Depois: Kafka.
// A lógica de negócio NUNCA muda — só o transport.

interface EventTransport {
  publish(event: DomainEvent): Promise<void>
}

// ─── N8N Webhook Transport (v1 — atual) ──────────────────────────────────────

class N8NWebhookTransport implements EventTransport {
  private readonly webhookUrl: string

  constructor() {
    this.webhookUrl = process.env.N8N_WEBHOOK_URL ?? ''
    if (!this.webhookUrl) {
      console.warn('[EventBus] N8N_WEBHOOK_URL não configurado — eventos serão logados apenas.')
    }
  }

  async publish(event: DomainEvent): Promise<void> {
    if (!this.webhookUrl) {
      console.log('[EventBus] [DRY RUN]', JSON.stringify(event))
      return
    }

    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...event,
        meta: {
          timestamp: new Date().toISOString(),
          source: 'gnos-api',
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`[EventBus] Falha ao publicar evento: ${response.statusText}`)
    }
  }
}

// ─── Redis BullMQ Transport (v2 — futuro) ────────────────────────────────────
// class RedisBullMQTransport implements EventTransport {
//   async publish(event: DomainEvent): Promise<void> {
//     await queue.add(event.type, event.payload)
//   }
// }

// ─── Kafka Transport (v3 — escala) ───────────────────────────────────────────
// class KafkaTransport implements EventTransport {
//   async publish(event: DomainEvent): Promise<void> {
//     await producer.send({ topic: event.type, messages: [{ value: JSON.stringify(event.payload) }] })
//   }
// }

// ─── EventBus ────────────────────────────────────────────────────────────────

class EventBus {
  private readonly transport: EventTransport

  constructor(transport: EventTransport) {
    this.transport = transport
  }

  async emit(event: DomainEvent): Promise<void> {
    console.log(`[EventBus] Emitindo evento: ${event.type}`)
    try {
      await this.transport.publish(event)
    } catch (error) {
      // Nunca deixa o EventBus quebrar a requisição principal
      console.error(`[EventBus] Erro ao emitir ${event.type}:`, error)
    }
  }
}

// ─── Singleton ────────────────────────────────────────────────────────────────

export const eventBus = new EventBus(new N8NWebhookTransport())

// ─── Uso ─────────────────────────────────────────────────────────────────────
// import { eventBus } from '../events/event-bus.js'
//
// await eventBus.emit({
//   type: 'lead.created',
//   payload: { name: 'João', email: 'joao@email.com', service: 'automation' }
// })

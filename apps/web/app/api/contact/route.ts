import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      name: string; email: string; phone?: string; service: string; message?: string
    }

    if (!body.name || !body.email || !body.service) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 })
    }

    // Envia para N8N via webhook
    const webhookUrl = process.env.N8N_WEBHOOK_URL
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'lead.created',
          payload: {
            name:    body.name,
            email:   body.email,
            phone:   body.phone,
            service: body.service.toUpperCase(),
            message: body.message,
            source:  'site',
          },
          meta: { timestamp: new Date().toISOString(), source: 'gnos-web' },
        }),
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[POST /api/contact]', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

import { PrismaClient, ServiceType, LeadStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // ─── Seed: Templates de Automação ─────────────────────────────────────────
  const automationTemplates = await Promise.all([
    prisma.automationTemplate.upsert({
      where: { id: 'tpl-whatsapp-leads' },
      update: {},
      create: {
        id: 'tpl-whatsapp-leads',
        name: 'Captação de Leads via WhatsApp',
        description:
          'Recebe mensagem no WhatsApp Business, qualifica o lead e salva no CRM automaticamente.',
        category: 'whatsapp',
        n8nWorkflow: {
          name: 'WhatsApp Lead Capture',
          nodes: [],
          connections: {},
          // Exportar workflow real do N8N e substituir aqui
        },
        isPublic: true,
      },
    }),

    prisma.automationTemplate.upsert({
      where: { id: 'tpl-follow-up' },
      update: {},
      create: {
        id: 'tpl-follow-up',
        name: 'Follow-up Automático de Leads',
        description:
          'Envia mensagens de follow-up automaticamente após X dias sem resposta do lead.',
        category: 'crm',
        n8nWorkflow: {
          name: 'Lead Follow-up',
          nodes: [],
          connections: {},
        },
        isPublic: true,
      },
    }),

    prisma.automationTemplate.upsert({
      where: { id: 'tpl-monthly-report' },
      update: {},
      create: {
        id: 'tpl-monthly-report',
        name: 'Relatório Mensal Automático',
        description:
          'Gera e envia relatório de performance mensal para o cliente via email.',
        category: 'report',
        n8nWorkflow: {
          name: 'Monthly Report',
          nodes: [],
          connections: {},
        },
        isPublic: false,
      },
    }),
  ])

  console.log(
    `✅ ${automationTemplates.length} templates de automação criados.`,
  )

  // ─── Seed: Lead de exemplo (apenas em desenvolvimento) ────────────────────
  if (process.env.NODE_ENV === 'development') {
    const leadExemplo = await prisma.lead.upsert({
      where: { email: 'exemplo@gnos.digital' },
      update: {},
      create: {
        name: 'Lead Exemplo',
        email: 'exemplo@gnos.digital',
        phone: '+55 11 99999-9999',
        company: 'Empresa Exemplo LTDA',
        service: ServiceType.AUTOMATION,
        message: 'Preciso automatizar meu processo de vendas.',
        status: LeadStatus.NEW,
        source: 'seed',
      },
    })

    console.log(`✅ Lead de exemplo criado: ${leadExemplo.email}`)
  }

  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

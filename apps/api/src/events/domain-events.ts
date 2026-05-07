// ─── Domain Events ────────────────────────────────────────────────────────────
// Todos os eventos de domínio da Gnos são definidos aqui.
// Adicione novos eventos conforme novos bounded contexts forem criados.

export type DomainEvent =
  // Leads (Marketing / Site)
  | { type: 'lead.created'; payload: { name: string; email: string; phone?: string; service: string } }
  | { type: 'lead.converted'; payload: { leadId: string; clientId: string } }

  // Clientes (Portal)
  | { type: 'client.created'; payload: { clientId: string; name: string; email: string } }
  | { type: 'client.onboarded'; payload: { clientId: string } }

  // Projetos
  | { type: 'project.created'; payload: { projectId: string; clientId: string; type: 'automation' | 'marketing' | 'software' } }
  | { type: 'project.completed'; payload: { projectId: string; clientId: string } }

  // Automações
  | { type: 'automation.triggered'; payload: { automationId: string; clientId: string; source: string } }
  | { type: 'automation.failed'; payload: { automationId: string; error: string } }

'use client'

import { useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const ease = [0.32, 0.72, 0, 1] as const

const services = [
  {
    icon: '⚡',
    id: 'automation',
    title: 'Automação',
    description: 'Elimine o trabalho repetitivo. Conectamos seus sistemas, criamos fluxos inteligentes com N8N e AI Agents, e fazemos sua operação rodar no piloto automático.',
    items: ['Fluxos N8N customizados', 'AI Agents', 'Integrações entre sistemas', 'WhatsApp Business API'],
  },
  {
    icon: '📣',
    id: 'marketing',
    title: 'Marketing',
    description: 'Amplifique sua presença digital com estratégia real. Conteúdo, tráfego, posicionamento — tudo alinhado para gerar resultados mensuráveis.',
    items: ['Estratégia de conteúdo', 'Gestão de redes sociais', 'Tráfego pago', 'SEO e presença orgânica'],
  },
  {
    icon: '💻',
    id: 'software',
    title: 'Software',
    description: 'Da ideia ao produto. Criamos dashboards, sistemas internos, sites e SaaS sob medida — com código limpo, escalável e sem dívida técnica.',
    items: ['Sites e landing pages', 'Sistemas web (SaaS)', 'Dashboards internos', 'APIs e integrações'],
  },
]

function SpotlightCard({ icon, title, description, items }: (typeof services)[0]) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0d0d] p-8 inset-top-glow',
        'transition-all duration-300 hover:border-white/[0.13]',
      )}
    >
      {/* Spotlight glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: visible ? 1 : 0,
          background: `radial-gradient(350px at ${pos.x}px ${pos.y}px, rgba(124,58,237,0.07), transparent 80%)`,
        }}
      />

      <div className="relative z-10 flex flex-col gap-5">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="mb-2 text-lg font-semibold text-zinc-100 tracking-tight">{title}</h3>
          <p className="text-sm leading-relaxed text-zinc-500">{description}</p>
        </div>
        <ul className="flex flex-col gap-2 border-t border-white/[0.06] pt-5 mt-auto">
          {items.map(item => (
            <li key={item} className="flex items-center gap-2.5 text-xs text-zinc-600">
              <span className="h-1 w-1 rounded-full bg-violet-500/60 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function Services() {
  return (
    <section id="servicos" className="bg-black py-32">
      <div className="container">
        <div className="mb-16 max-w-xl">
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.4, ease }}
            className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-violet-500"
          >
            ◈ O que fazemos
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="text-4xl font-bold tracking-tighter text-zinc-50 sm:text-5xl"
          >
            Três pilares.<br />
            <span className="gradient-text">Um só parceiro.</span>
          </motion.h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, ease, delay: i * 0.08 }}
            >
              <SpotlightCard {...s} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

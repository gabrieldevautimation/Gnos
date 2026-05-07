'use client'

import { motion } from 'framer-motion'

const ease = [0.32, 0.72, 0, 1] as const

const steps = [
  { n: '01', title: 'Diagnóstico',  desc: 'Entendemos seu negócio, mapeamos os gargalos e identificamos onde automação, marketing ou software geram mais impacto.' },
  { n: '02', title: 'Proposta',     desc: 'Desenvolvemos uma solução sob medida com escopo claro, cronograma realista e investimento definido. Sem surpresas.' },
  { n: '03', title: 'Execução',     desc: 'Construímos rápido e com qualidade. Você acompanha cada entrega em tempo real pelo nosso portal de clientes.' },
  { n: '04', title: 'Resultado',    desc: 'Entregamos, medimos e evoluímos. Seu negócio opera melhor. Esse é o único resultado que nos interessa.' },
]

export function Process() {
  return (
    <section id="processo" className="relative border-y border-white/[0.06] bg-[#0a0a0a]/70 backdrop-blur-sm py-32">
      <div className="container">
        <div className="mb-16 max-w-xl">
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.4, ease }}
            className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-violet-500"
          >
            ◈ Como trabalhamos
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="text-4xl font-bold tracking-tighter text-zinc-50 sm:text-5xl"
          >
            Simples.<br />
            <span className="gradient-text">Do diagnóstico ao resultado.</span>
          </motion.h2>
        </div>

        <div className="max-w-2xl flex flex-col">
          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease, delay: i * 0.1 }}
              className="group flex gap-8 pb-12 last:pb-0"
            >
              {/* Left: number + line */}
              <div className="flex flex-col items-center gap-0 flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.1] bg-[#111] text-xs font-bold text-violet-400 transition-colors group-hover:border-violet-500/30 group-hover:bg-violet-500/[0.06]">
                  {step.n}
                </div>
                {i < steps.length - 1 && (
                  <div className="mt-3 w-px flex-1 bg-gradient-to-b from-white/[0.08] to-transparent" />
                )}
              </div>

              {/* Right: content */}
              <div className="pb-2 pt-1.5">
                <h3 className="mb-2 text-base font-semibold text-zinc-100 tracking-tight">{step.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

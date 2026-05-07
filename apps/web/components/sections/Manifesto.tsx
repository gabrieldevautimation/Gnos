'use client'

import { motion } from 'framer-motion'

const ease = [0.32, 0.72, 0, 1] as const
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

const lines = [
  { text: 'Na filosofia antiga, Gnose não era apenas saber.', accent: true },
  { text: 'Era um conhecimento que transformava.', accent: false },
  { text: 'A diferença entre acumular informação', accent: false },
  { text: 'e ser verdadeiramente iluminado por ela.', accent: true },
]

export function Manifesto() {
  return (
    <section id="manifesto" className="relative border-y border-white/[0.06] bg-[#0a0a0a] py-32">
      <div className="container max-w-3xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="mb-10 text-xs font-semibold uppercase tracking-[0.14em] text-violet-500"
        >
          ◈ Sobre a Gnos
        </motion.p>

        <div className="flex flex-col gap-1.5 mb-12">
          {lines.map((l, i) => (
            <motion.p
              key={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.6, ease, delay: i * 0.1 }}
              className={`font-sans text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl ${
                l.accent ? 'text-zinc-100' : 'text-zinc-600'
              }`}
            >
              {l.text}
            </motion.p>
          ))}
        </div>

        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.6, ease, delay: 0.5 }}
          className="border-l-2 border-violet-500/40 pl-5 text-base leading-relaxed text-zinc-500 sm:text-lg"
        >
          É esse princípio que guia tudo que construímos. Cada automação, cada
          campanha, cada linha de código. Não somos uma agência — somos parceiros
          de conhecimento.
        </motion.p>
      </div>
    </section>
  )
}

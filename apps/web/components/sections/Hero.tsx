'use client'

import { motion } from 'framer-motion'

const ease = [0.32, 0.72, 0, 1] as const

const item = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0 },
}

export function Hero() {
  const go = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="home" className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-black">
      {/* Grid background */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-100" />

      {/* Top radial gradient — very subtle brand color */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(124,58,237,0.08) 0%, transparent 100%)',
        }}
      />

      {/* Radial vignette at edges */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.7) 100%)' }}
      />

      {/* Content */}
      <div className="container relative z-10 pt-36 pb-24">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.09 }}
          className="flex flex-col items-start gap-7"
        >
          {/* Badge */}
          <motion.div variants={item} transition={{ duration: 0.5, ease }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-zinc-400 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
              Studio de Tecnologia
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={item}
            transition={{ duration: 0.6, ease }}
            className="max-w-3xl text-balance font-sans text-6xl font-bold tracking-tighter text-zinc-50 sm:text-7xl md:text-8xl lg:text-[5.5rem] leading-[1.0]"
          >
            <span className="block">Nós automatizamos.</span>
            <span className="block gradient-text">Você cresce.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={item}
            transition={{ duration: 0.5, ease }}
            className="max-w-md text-base leading-relaxed text-zinc-500 sm:text-lg"
          >
            Automação inteligente, marketing estratégico e software sob medida
            para negócios que recusam ficar pra trás.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={item}
            transition={{ duration: 0.5, ease }}
            className="flex flex-wrap items-center gap-3"
          >
            <button
              onClick={() => go('#contato')}
              className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-zinc-100"
            >
              Falar com a Gnos
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={() => go('#servicos')}
              className="inline-flex items-center rounded-md border border-white/10 px-5 py-2.5 text-sm font-medium text-zinc-400 transition-all hover:border-white/20 hover:text-zinc-200 hover:bg-white/[0.03]"
            >
              Ver serviços
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="absolute bottom-10 left-8 flex items-center gap-3 text-xs tracking-widest text-zinc-700 uppercase"
        >
          <span className="h-px w-8 bg-zinc-800" />
          scroll
        </motion.div>
      </div>
    </section>
  )
}
